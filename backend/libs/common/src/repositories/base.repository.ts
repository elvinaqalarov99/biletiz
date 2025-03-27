/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  DeepPartial,
  FindManyOptions,
  FindOneOptions,
  FindOptionsWhere,
  In,
  LessThan,
  MoreThan,
  Repository,
  SelectQueryBuilder,
} from 'typeorm';
import { BaseEntity } from '../entities/base.entity';

@Injectable()
export abstract class BaseRepository<T extends BaseEntity> {
  constructor(protected readonly repository: Repository<T>) {}

  async create(data: DeepPartial<T>): Promise<T> {
    const entity = this.repository.create(data);
    return this.repository.save(entity);
  }

  async createMany(data: DeepPartial<T>[]): Promise<T[]> {
    const entities = this.repository.create(data);
    return this.repository.save(entities);
  }

  async findById(id: string): Promise<T | null> {
    return this.repository.findOne({
      where: { id } as FindOptionsWhere<T>,
    });
  }

  async findByIds(ids: string[]): Promise<T[]> {
    return this.repository.find({
      where: { id: In(ids) } as FindOptionsWhere<T>,
    });
  }

  async findOne(options: FindOneOptions<T>): Promise<T | null> {
    return this.repository.findOne(options);
  }

  async findOneOrFail(options: FindOneOptions<T>): Promise<T> {
    const entity = await this.findOne(options);
    if (!entity) {
      throw new NotFoundException('Entity not found');
    }
    return entity;
  }

  async find(options?: FindManyOptions<T>): Promise<T[]> {
    return this.repository.find(options);
  }

  async findAndCount(options?: FindManyOptions<T>): Promise<[T[], number]> {
    return this.repository.findAndCount(options);
  }

  async update(id: string, data: DeepPartial<T>): Promise<void> {
    await this.repository.update(id, data as any);
  }

  async updateMany(
    criteria: FindOptionsWhere<T>,
    data: DeepPartial<T>,
  ): Promise<void> {
    await this.repository.update(criteria, data as any);
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async softDelete(id: string): Promise<void> {
    await this.repository.softDelete(id);
  }

  async restore(id: string): Promise<void> {
    await this.repository.restore(id);
  }

  async count(options?: FindManyOptions<T>): Promise<number> {
    return this.repository.count(options);
  }

  createQueryBuilder(alias: string): SelectQueryBuilder<T> {
    return this.repository.createQueryBuilder(alias);
  }

  async incrementCount(id: string, field: string): Promise<void> {
    await this.repository.increment({ id } as any, field, 1);
  }

  async decrementCount(id: string, field: string): Promise<void> {
    await this.repository.decrement({ id } as any, field, 1);
  }

  async paginate(
    page: number = 1,
    limit: number = 10,
    options?: FindManyOptions<T>,
  ): Promise<[T[], number]> {
    const [items, total] = await this.repository.findAndCount({
      ...options,
      skip: (page - 1) * limit,
      take: limit,
    });

    return [items, total];
  }

  async findCreatedAfter(date: Date): Promise<T[]> {
    return this.repository.find({
      where: {
        createdAt: MoreThan(date),
      } as FindOptionsWhere<T>,
    });
  }

  async findCreatedBefore(date: Date): Promise<T[]> {
    return this.repository.find({
      where: {
        createdAt: LessThan(date),
      } as FindOptionsWhere<T>,
    });
  }

  async bulkSoftDelete(ids: string[]): Promise<void> {
    await this.repository.softDelete(ids);
  }

  async bulkRestore(ids: string[]): Promise<void> {
    await this.repository.restore(ids);
  }
}
