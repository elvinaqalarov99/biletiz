import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { PermissionEntity } from "src/common/entities/permission.entity";
import { In, Repository } from "typeorm";
import { PermissionCreateDto } from "./dto/permission-create.dto";

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(PermissionEntity)
    private permissionRepository: Repository<PermissionEntity>,
  ) {}

  async findByIds(ids: number[]): Promise<PermissionEntity[] | []> {
    if (!ids.length) return [];

    return (await this.permissionRepository.findBy({ id: In(ids) })) ?? [];
  }

  async findOne(data: object): Promise<PermissionEntity | null> {
    return await this.permissionRepository.findOne({
      where: data, // Or use other criteria like email, etc.
    });
  }

  async createPermission(data: PermissionCreateDto): Promise<PermissionEntity> {
    const role = this.permissionRepository.create(data);

    return await this.permissionRepository.save(role);
  }

  async updatePermission(
    id: number,
    roleData: PermissionCreateDto,
  ): Promise<PermissionEntity> {
    const role = await this.findOne({ id });

    if (!role) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }

    // Update role fields with provided values from DTO
    Object.assign(role, roleData);

    return await this.permissionRepository.save(role);
  }

  async deletePermission(id: number): Promise<PermissionEntity> {
    const role = await this.findOne({ id });

    if (!role) {
      throw new NotFoundException(`Permission with id ${id} not found`);
    }

    return await this.permissionRepository.remove(role);
  }
}
