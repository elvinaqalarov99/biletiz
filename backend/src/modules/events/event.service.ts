import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EventEntity } from 'src/common/entities/event.entity';
import { VenueEntity } from 'src/common/entities/venue.entity';
import { DataSource, InsertResult, QueryRunner, Repository } from 'typeorm';

@Injectable()
export class EventService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(EventEntity)
    private readonly eventRepository: Repository<EventEntity>,
  ) {}

  async all(
    data: object = {},
    relations: string[] = [],
  ): Promise<EventEntity[] | []> {
    return (
      (await this.eventRepository.find({
        where: data,
        relations: relations,
      })) ?? []
    );
  }

  async findOne(data: object): Promise<EventEntity | null> {
    return await this.eventRepository.findOne({
      where: data,
    });
  }

  async upsert(data: any): Promise<InsertResult | undefined> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const upsertRes = await queryRunner.manager.upsert(
        EventEntity,
        data as object,
        {
          conflictPaths: ['externalId'],
          skipUpdateIfNoValuesChanged: true,
        },
      );

      // update event venues
      await this.saveVenues(queryRunner, upsertRes, data);

      // ✅ Commit transaction if everything is successful
      await queryRunner.commitTransaction();

      return upsertRes;
    } catch (error) {
      console.error('Error saving events, rolling back...', error);
      await queryRunner.rollbackTransaction();
    } finally {
      // Release queryRunner connection
      await queryRunner.release();
    }
  }

  async saveVenues(
    queryRunner: QueryRunner,
    upsertRes: InsertResult,
    data: any,
  ) {
    if (data.venues && upsertRes.identifiers[0]) {
      const eventId = upsertRes.identifiers[0].id;

      // Fetch currently linked venues to prevent duplicates
      const existingVenues = await queryRunner.manager
        .createQueryBuilder()
        .relation(EventEntity, 'venues')
        .of(eventId)
        .loadMany();

      // Extract existing venue IDs
      const existingVenueIds = existingVenues.map(
        (venue: VenueEntity) => venue.id,
      );

      // Filter out already linked venues
      const newVenues = data.venues.filter(
        (venue: VenueEntity) => !existingVenueIds.includes(venue.id),
      );

      if (newVenues.length > 0) {
        await queryRunner.manager
          .createQueryBuilder()
          .relation(EventEntity, 'venues')
          .of(eventId)
          .add(newVenues);
      }
    }
  }
}
