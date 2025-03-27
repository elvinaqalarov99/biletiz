import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { VenueEntity } from 'src/common/entities/venue.entity';
import { InsertResult, Repository } from 'typeorm';

@Injectable()
export class VenueService {
  constructor(
    @InjectRepository(VenueEntity)
    private readonly venueRepository: Repository<VenueEntity>,
  ) {}

  async all(data: object = {}): Promise<VenueEntity[] | []> {
    return (
      (await this.venueRepository.find({
        where: data,
      })) ?? []
    );
  }

  async findOne(data: object): Promise<VenueEntity | null> {
    return await this.venueRepository.findOne({
      where: data,
    });
  }

  async find(data: object): Promise<VenueEntity[] | null> {
    return await this.venueRepository.find({
      where: data,
    });
  }

  async upsert(data: object): Promise<InsertResult> {
    return this.venueRepository.upsert(data, ['externalId']);
  }
}
