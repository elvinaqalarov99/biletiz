import { TypeOrmModule } from "@nestjs/typeorm";
import { UserEntity } from "./entities/user.entity";
import { RoleEntity } from "./entities/role.entity";
import { PermissionEntity } from "./entities/permission.entity";
import { UserRoleEntity } from "./entities/user-role.entity";
import { RolePermissionEntity } from "./entities/role-permission.entity";
import { DynamicModule } from "@nestjs/common";
import { EntityClassOrSchema } from "@nestjs/typeorm/dist/interfaces/entity-class-or-schema.type";

export const getBaseTypeOrmFeature: (
  appendEntities?: EntityClassOrSchema[],
) => DynamicModule = (appendEntities: []) => {
  let entities = [
    UserEntity,
    RoleEntity,
    PermissionEntity,
    UserRoleEntity,
    RolePermissionEntity,
  ];
  entities = [...entities, ...(appendEntities ?? [])];

  return TypeOrmModule.forFeature(entities);
};

export async function sleep(ms: number): Promise<void> {
  console.log(`Sleeping... for ${ms} ms`);
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function renameKey<T extends Record<string, any>>(
  obj: T,
  oldKey: string,
  newKey: string,
): Record<string, any> {
  if (!(oldKey in obj)) return obj; // If key doesn't exist, return original object

  const { [oldKey]: value, ...rest } = obj; // Extract old key
  return { ...rest, [newKey]: value }; // Insert new key
}

export function removeKey<T extends Record<string, any>, K extends string>(
  obj: T,
  keyToRemove: K,
): Omit<T, K> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { [keyToRemove]: _, ...rest } = obj;

  return rest;
}

export function toCamelCase(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function keysToCamelCaseDeep<T extends Record<string, any>>(
  obj: T,
): any {
  if (Array.isArray(obj)) {
    return obj.map(keysToCamelCaseDeep); // Recursively convert array elements
  } else if (obj !== null && typeof obj === "object") {
    return Object.fromEntries(
      Object.entries(obj).map(([key, value]) => [
        toCamelCase(key),
        keysToCamelCaseDeep(value),
      ]),
    );
  }
  return obj;
}
