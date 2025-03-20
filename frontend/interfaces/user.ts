import { Category } from "./category";

export interface User {
  id: number;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  profilePicture?: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  address?: string;
  emailVerified?: boolean;
  twoFactorEnabled?: boolean;
  failedLoginAttempts?: number;
  lastLoginAt?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
  categoryPreferences: Category[];
}
