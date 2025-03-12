import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class PermissionCreateDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
