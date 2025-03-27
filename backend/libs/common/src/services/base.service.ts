import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  allRetryableColumns,
  databaseErrorCodes,
  transactionSettings,
} from 'src/modules/auth/constants';

import {
  DataSource,
  DeepPartial,
  EntityTarget,
  Equal,
  FindManyOptions,
  FindOneOptions,
  FindOperator,
  FindOptionsWhere,
  In,
  Not,
  ObjectLiteral,
  QueryRunner,
  Repository,
} from 'typeorm';
import { QueryDeepPartialEntity } from 'typeorm/query-builder/QueryPartialEntity';
import { PaginatedResult } from '../definitions/pagination.interface';
import { PaginationDto } from '../dtos/pagination.dto';

@Injectable()
export abstract class BaseService<T extends { id: string } & ObjectLiteral> {
  protected readonly logger = new Logger(this.constructor.name);
  protected abstract readonly entityTarget: EntityTarget<T>;

  private readonly deadlock = databaseErrorCodes.deadlock;
  private readonly serialization = databaseErrorCodes.serialization;
  private readonly lockTimeout = databaseErrorCodes.lockTimeout;
  private readonly duplicateKey = databaseErrorCodes.duplicateKey;

  private readonly defaultTimeout: number = transactionSettings.defaultTimeout;
  private readonly maxRetries: number = transactionSettings.maxRetries;
  private readonly initialDelay: number = transactionSettings.delays.initial;
  private readonly maxDelay: number = transactionSettings.delays.max;
  private readonly isolationLevel = transactionSettings.isolationLevel;
  private readonly retryableColumns = allRetryableColumns;

  constructor(
    protected readonly repository: Repository<T>,
    protected readonly dataSource: DataSource,
  ) {}

  protected async runTransaction<U>(
    action: (queryRunner: QueryRunner) => Promise<U>,
    timeout = this.defaultTimeout,
    maxRetries = this.maxRetries,
    context?: string,
  ): Promise<U> {
    let attempt = 1;
    let lastError: Error | null = null;
    let delay = this.initialDelay;
    let queryRunner: QueryRunner | null = null;

    try {
      while (attempt <= maxRetries) {
        queryRunner = this.dataSource.createQueryRunner();
        let timeoutId: NodeJS.Timeout;
        let isTimeoutTriggered = false;

        try {
          await queryRunner.connect();
          await queryRunner.startTransaction(this.isolationLevel);

          const result = await Promise.race([
            action(queryRunner),
            new Promise<never>((_, reject) => {
              timeoutId = setTimeout(() => {
                isTimeoutTriggered = true;
                reject(new Error(`Transaction timeout after ${timeout}ms`));
              }, timeout);
            }),
          ]);

          await queryRunner.commitTransaction();
          clearTimeout(timeoutId!);
          return result;
        } catch (error) {
          clearTimeout(timeoutId!);

          if (queryRunner.isTransactionActive) {
            try {
              await queryRunner.rollbackTransaction();
            } catch (rollbackError) {
              this.logger.error('Error rolling back transaction', {
                rollbackError,
                originalError: error,
                context,
                attempt,
              });
              throw new Error('Transaction rollback failed');
            }
          }

          if (error instanceof Error) {
            lastError = error;

            if (
              this.shouldRetryTransaction(
                error,
                attempt,
                maxRetries,
                isTimeoutTriggered,
              )
            ) {
              this.logger.warn(
                `Transaction${context ? ` (${context})` : ''} attempt ${attempt}/${maxRetries} failed, retrying...`,
                {
                  error: error.message,
                  attempt,
                  context,
                  delay,
                },
              );

              attempt++;
              await this.delay(delay);
              delay = Math.min(delay * 2, this.maxDelay);
              continue;
            }
          }

          throw this.handleError(lastError || error);
        } finally {
          if (queryRunner) {
            try {
              await queryRunner.release();
            } catch (releaseError) {
              this.logger.error('Error releasing query runner', {
                releaseError,
                context,
                attempt,
              });
              try {
                await queryRunner.connection.destroy();
              } catch (destroyError) {
                this.logger.error('Failed to force destroy connection', {
                  destroyError,
                });
              }
            }
          }
        }
      }

      throw this.handleError(
        lastError || new Error('Transaction failed after all retry attempts'),
      );
    } finally {
      if (queryRunner) {
        try {
          await queryRunner.release();
        } catch (error) {
          this.logger.error('Final cleanup failed', { error });
        }
      }
    }
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  private shouldRetryTransaction(
    error: any,
    attempt: number,
    maxRetries: number,
    isTimeout: boolean = false,
  ): boolean {
    if (attempt >= maxRetries) return false;

    if (isTimeout) return false;

    const errorCode = error.code;
    if (!errorCode) return false;

    if (errorCode === this.duplicateKey) {
      return this.isDuplicateKeyRetryable(error);
    }

    return [
      this.deadlock,
      this.serialization,
      this.lockTimeout,
      this.duplicateKey,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    ].includes(errorCode);
  }

  private isDuplicateKeyRetryable(error: unknown): boolean {
    const detail = (error as { detail?: string }).detail;
    if (!detail) return false;

    return this.retryableColumns.some((column) =>
      detail.toLowerCase().includes(column),
    );
  }

  // TODO: Move upward code to repo level

  protected handleError(error: any): Error {
    if (
      error instanceof BadRequestException ||
      error instanceof NotFoundException
    ) {
      throw error;
    }

    if (error?.code === this.duplicateKey) {
      throw new BadRequestException('Duplicate entry');
    }

    if (error?.code === '23503') {
      throw new BadRequestException('Referenced entity does not exist');
    }

    this.logger.error('Database operation failed:', { error });
    throw new InternalServerErrorException('An unexpected error occurred');
  }

  async create(data: DeepPartial<T>): Promise<T> {
    return this.runTransaction(
      async (queryRunner) => {
        const entity = this.repository.create(data);
        return await queryRunner.manager.save(this.entityTarget, entity);
      },
      undefined,
      undefined,
      'create',
    );
  }

  async createMany(dataArray: DeepPartial<T>[]): Promise<T[]> {
    return this.runTransaction(
      async (queryRunner) => {
        const entities = dataArray.map((data) => this.repository.create(data));
        return await queryRunner.manager.save(this.entityTarget, entities);
      },
      undefined,
      undefined,
      'createMany',
    );
  }

  async update(id: string, data: QueryDeepPartialEntity<T>): Promise<void> {
    await this.runTransaction(
      async (queryRunner) => {
        await this.findById(id);
        await queryRunner.manager.update(
          this.entityTarget,
          this.createIdWhere(id),
          data,
        );
      },
      undefined,
      undefined,
      'update',
    );
  }

  async delete(id: string): Promise<void> {
    await this.runTransaction(
      async (queryRunner) => {
        await this.findById(id);
        await queryRunner.manager.delete(
          this.entityTarget,
          this.createIdWhere(id),
        );
      },
      undefined,
      undefined,
      'delete',
    );
  }

  async softDelete(id: string): Promise<void> {
    await this.runTransaction(
      async (queryRunner) => {
        await this.findById(id);
        await queryRunner.manager.softDelete(
          this.entityTarget,
          this.createIdWhere(id),
        );
      },
      undefined,
      undefined,
      'softDelete',
    );
  }

  async restore(id: string): Promise<void> {
    await this.runTransaction(
      async (queryRunner) => {
        await queryRunner.manager.restore(this.entityTarget, id);
      },
      undefined,
      undefined,
      'restore',
    );
  }

  async incrementCount(id: string, field: keyof T): Promise<void> {
    await this.runTransaction(
      async (queryRunner) => {
        await this.findById(id);
        await queryRunner.manager
          .createQueryBuilder()
          .update(this.entityTarget)
          .set({ [field]: () => `${String(field)} + 1` })
          .where('id = :id', { id })
          .execute();
      },
      undefined,
      undefined,
      'incrementCount',
    );
  }

  async decrementCount(id: string, field: keyof T): Promise<void> {
    await this.runTransaction(
      async (queryRunner) => {
        await this.findById(id);
        await queryRunner.manager
          .createQueryBuilder()
          .update(this.entityTarget)
          .set({ [field]: () => `${String(field)} - 1` })
          .where('id = :id', { id })
          .execute();
      },
      undefined,
      undefined,
      'decrementCount',
    );
  }

  async findById(id: string): Promise<T> {
    const entity = await this.repository.findOne({
      where: this.createWhereCondition('id', Equal(id)),
    });

    if (!entity) {
      throw new NotFoundException(`Entity with ID "${id}" not found`);
    }
    return entity;
  }

  protected createWhereCondition<K extends keyof T, V extends T[K]>(
    field: K,
    value: V | FindOperator<V>,
  ): FindOptionsWhere<T> {
    return {
      [field]: value,
    } as FindOptionsWhere<T>;
  }

  protected createIdWhere(id: string): FindOptionsWhere<T> {
    return {
      id: Equal(id),
    } as FindOptionsWhere<T>;
  }

  async findByIds(ids: string[]): Promise<T[]> {
    const where: FindOptionsWhere<T> = {
      id: In(ids),
    } as FindOptionsWhere<T>;

    const entities = await this.repository.find({ where });

    if (entities.length !== ids.length) {
      const foundIds = entities.map((e) => e['id']);
      const missingIds = ids.filter((id) => !foundIds.includes(id));
      throw new NotFoundException(
        `Entities with IDs "${missingIds.join(', ')}" not found`,
      );
    }
    return entities;
  }

  async findOne(options: FindOneOptions<T>): Promise<T> {
    const entity = await this.repository.findOne(options);
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }
    return entity;
  }

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async paginate(paginationDto: PaginationDto): Promise<PaginatedResult<T>> {
    const page = paginationDto.page ?? 1;
    const limit = paginationDto.limit ?? 10;
    const skip = (page - 1) * limit;

    const [items, total] = await this.repository.findAndCount({
      skip,
      take: limit,
    });

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNext: page * limit < total,
      hasPrevious: page > 1,
    };
  }

  protected async validateUnique(
    field: keyof T,
    value: T[keyof T],
    excludeId?: string,
  ): Promise<void> {
    const conditions: FindOptionsWhere<T>[] = [
      this.createWhereCondition(field, Equal(value)),
    ];

    if (excludeId) {
      conditions.push(this.createWhereCondition('id', Not(excludeId)));
    }

    const exists = await this.repository.findOne({ where: conditions });
    if (exists) {
      throw new BadRequestException(`${String(field)} already exists`);
    }
  }
}
