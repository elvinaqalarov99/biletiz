import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { UserCategoryPreferenceCreateDto } from "./dto/user-category-preferences-create.dto";
import { UserCategoryPreferenceEntity } from "src/common/entities/user-category-preference.entity";

@Injectable()
export class UserCategoryPreferencesService {
  constructor(
    @InjectRepository(UserCategoryPreferenceEntity)
    private entityRepository: Repository<UserCategoryPreferenceEntity>,
  ) {}

  async all(data: object = {}): Promise<UserCategoryPreferenceEntity[] | []> {
    return (
      (await this.entityRepository.find({
        where: data,
      })) ?? []
    );
  }

  async findOne(data: object): Promise<UserCategoryPreferenceEntity | null> {
    return await this.entityRepository.findOne({
      where: data, // Or use other criteria like email, etc.
    });
  }

  async create(
    data: UserCategoryPreferenceCreateDto,
  ): Promise<UserCategoryPreferenceEntity> {
    const entity = this.entityRepository.create(data);

    return await this.entityRepository.save(entity);
  }

  async delete(id: number) {
    const entity = await this.findOne({ id });

    if (!entity) {
      throw new NotFoundException(`Entity with id ${id} not found`);
    }

    return await this.entityRepository.remove(entity);
  }
}
