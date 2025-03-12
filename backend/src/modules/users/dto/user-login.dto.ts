import {
  IsString,
  MinLength,
  MaxLength,
  IsEmail,
  IsArray,
  IsOptional,
  IsDateString,
} from "class-validator";

export class UserLoginDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, {
    message: "Password is too short. Minimum length is 6 characters",
  })
  @MaxLength(20, {
    message: "Password is too long. Maximum length is 20 characters",
  })
  password: string;

  @IsOptional()
  @IsString()
  firstName?: string;

  @IsOptional()
  @IsString()
  lastName?: string;

  @IsOptional()
  @IsString()
  address?: string;

  @IsOptional()
  @IsDateString()
  dateOfBirth?: string;

  @IsOptional()
  @IsString()
  phoneNumber?: string;

  @IsOptional()
  @IsString()
  profilePicture?: string;

  @IsOptional()
  @IsArray() // Ensures the value is an array
  @IsString({ each: true }) // Ensure each element in the array is an integer (role ID)
  roles?: string[];
}
