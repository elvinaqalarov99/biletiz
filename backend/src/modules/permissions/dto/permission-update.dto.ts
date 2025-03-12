import { IsString, IsNotEmpty, IsOptional } from "class-validator";

export class PermissionUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;
}
