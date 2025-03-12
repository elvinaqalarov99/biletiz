import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { UserEntity } from "src/common/entities/user.entity";
import { In, Repository } from "typeorm";
import { UserLoginDto } from "./dto/user-login.dto";
import { RoleService } from "../roles/role.service";
import { RoleEntity } from "src/common/entities/role.entity";
import * as argon2 from "argon2";
import { UserUpdateDto } from "./dto/user-update.dto";

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private roleService: RoleService,
  ) {}

  async hashPassword(password: string): Promise<string> {
    return (await argon2.hash(password)).toString(); // Hash the password
  }

  async findOne(data: object): Promise<UserEntity | null> {
    return await this.userRepository.findOne({
      where: data, // Or use other criteria like email, etc.
      relations: ["roles", "roles.permissions"],
    });
  }

  async createUser(userData: UserLoginDto): Promise<UserEntity> {
    userData.password = await this.hashPassword(userData.password);

    // Create provided_roles|a default_user_role and assign it to the user (use Set to remove duplicates)
    const rolesArr = [
      ...new Set([...(userData?.roles ?? []), RoleEntity.USER_ROLE]),
    ];
    const roles = await this.roleService.findBy({
      name: In(rolesArr),
    });

    const user = this.userRepository.create({ ...userData, roles });

    return await this.userRepository.save(user);
  }

  async updateUser(id: number, userData: UserUpdateDto): Promise<UserEntity> {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    if (userData?.password) {
      userData.password = await this.hashPassword(userData.password);
    }

    let roles: RoleEntity[] | [] = user.roles;
    if (userData?.roles) {
      // Fetch provided roles
      roles = await this.roleService.findBy({
        name: In(userData?.roles ?? []),
      });
    }

    const data = { ...userData, roles };

    // Update user fields with provided values from DTO
    Object.assign(user, data);

    return await this.userRepository.save(user);
  }

  async deleteUser(id: number): Promise<UserEntity> {
    const user = await this.findOne({ id });

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return await this.userRepository.remove(user);
  }
}
