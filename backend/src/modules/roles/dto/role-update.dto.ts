import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsArray,
  IsInt,
} from "class-validator";

export class RoleUpdateDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsOptional()
  @IsString()
  readonly description?: string;

  @IsOptional()
  @IsArray() // Ensures the value is an array
  @IsInt({ each: true }) // Ensure each element in the array is a permission id
  permisions?: number[];
}
