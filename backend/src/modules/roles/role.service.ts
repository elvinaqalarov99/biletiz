import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { RoleEntity } from "src/common/entities/role.entity";
import { Repository } from "typeorm";
import { RoleCreateDto } from "./dto/role-create.dto";
import { PermissionService } from "../permissions/permission.service";
import { PermissionEntity } from "src/common/entities/permission.entity";

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private roleRepository: Repository<RoleEntity>,
    private permissionService: PermissionService,
  ) {}

  async findBy(data: object): Promise<RoleEntity[] | []> {
    return (
      (await this.roleRepository.find({
        where: data,
        relations: ["permissions"],
      })) ?? []
    );
  }

  async findOne(data: object): Promise<RoleEntity | null> {
    return await this.roleRepository.findOne({
      where: data, // Or use other criteria like email, etc.
      relations: ["permissions"],
    });
  }

  async createRole(data: RoleCreateDto): Promise<RoleEntity> {
    const role = this.roleRepository.create(data);

    let permissions: PermissionEntity[] = [];
    if (data?.permisionIds) {
      permissions = await this.permissionService.findByIds(
        data.permisionIds ?? [],
      );
    }

    return await this.roleRepository.save({ ...role, permissions });
  }

  async updateRole(id: number, roleData: RoleCreateDto): Promise<RoleEntity> {
    const role = await this.findOne({ id });

    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    let permissions: PermissionEntity[] = role.permissions;
    if (roleData?.permisionIds) {
      permissions = await this.permissionService.findByIds(
        roleData?.permisionIds ?? [],
      );
    }

    const data = { ...roleData, permissions };

    // Update role fields with provided values from DTO
    Object.assign(role, data);

    return await this.roleRepository.save(role);
  }

  async deleteRole(id: number): Promise<RoleEntity> {
    const role = await this.findOne({ id });

    if (!role) {
      throw new NotFoundException(`Role with id ${id} not found`);
    }

    return await this.roleRepository.remove(role);
  }
}
