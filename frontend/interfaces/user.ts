export interface User {
    id: number;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    profilePicture?: string;
    phoneNumber?: string;
    dateOfBirth?: Date;
    address?: string;
    emailVerified?: boolean;
    twoFactorEnabled?: boolean;
    failedLoginAttempts?: number;
    lastLoginAt?: Date;
    isActive?: boolean;
    createdAt?: Date;
    updatedAt?: Date;
}