import { IsNotEmpty, IsInt } from "class-validator";

export class UserCategoryPreferenceCreateDto {
  @IsInt()
  @IsNotEmpty()
  readonly userId: number;

  @IsInt()
  @IsNotEmpty()
  readonly categoryId: number;
}
