import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CategoryEntity } from "src/common/entities/category.entity";
import { InsertResult, Repository } from "typeorm";

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(CategoryEntity)
    private readonly categoryRepository: Repository<CategoryEntity>,
  ) {}

  async all(data: object = {}): Promise<CategoryEntity[] | []> {
    return (
      (await this.categoryRepository.find({
        where: data,
      })) ?? []
    );
  }

  async findOne(data: object): Promise<CategoryEntity | null> {
    return await this.categoryRepository.findOne({
      where: data,
      relations: ["events"],
    });
  }

  async upsert(data: object): Promise<InsertResult> {
    return this.categoryRepository.upsert(data, ["externalId"]);
  }
}
