import { HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as argon2 from "argon2";
import { UserService } from "src/modules/users/user.service";
import { Response } from "express";
import { ConfigService } from "@nestjs/config";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { UserEntity } from "../../common/entities/user.entity"; // ✅ Import from 'express'

@Injectable()
export class AuthService {
  private readonly ACCESS_TOKEN_COOKIE_TTL: number = 15 * 60 * 1000;
  private readonly REFRESH_TOKEN_COOKIE_TTL: number = 7 * 24 * 60 * 60 * 1000;

  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  generateTokens(userId: number): {
    accessToken: string;
    refreshToken: string;
  } {
    const payload: JwtPayload = { sub: userId };

    const accessToken = this.jwtService.sign(payload);

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>("jwt.refreshSecret"),
      expiresIn: this.configService.get<string>("jwt.refreshExpiresIn"),
    });

    return { accessToken, refreshToken };
  }

  async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity | null> {
    const user = await this.userService.findOne({ email });

    if (user && (await argon2.verify(user.password, password))) {
      return user;
    }

    return null;
  }

  // Method to validate the refresh token
  validateRefreshToken(refreshToken: string) {
    try {
      const decoded = this.jwtService.verify<JwtPayload>(refreshToken, {
        secret: this.configService.get<string>("jwt.refreshSecret"),
      });

      return { sub: decoded.sub };
    } catch {
      throw new Error("Invalid refresh token");
    }
  }

  // Refresh Access Token using Refresh Token
  refreshToken(res: Response, refreshToken: string): void {
    try {
      const payload = this.validateRefreshToken(refreshToken);
      const accessToken = this.jwtService.sign(payload);

      // Set the access token as an HTTP-only cookie
      res.cookie("access_token", accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
        maxAge: this.ACCESS_TOKEN_COOKIE_TTL, // 15 minutes
      });
    } catch (error: any) {
      throw new Error("Token is empty or Invalid refresh token");
    }
  }

  async signIn(
    res: Response,
    email: string,
    pass: string,
  ): Promise<{ statusCode: HttpStatus; accessToken: string }> {
    const user = await this.validateUser(email, pass);

    if (!user) {
      throw new UnauthorizedException();
    }

    const { accessToken, refreshToken } = this.generateTokens(user.id);

    // Set the access token as an HTTP-only cookie
    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: this.ACCESS_TOKEN_COOKIE_TTL, // 15 minutes
    });

    // Set the refresh token as an HTTP-only cookie
    res.cookie("refresh_token", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      maxAge: this.REFRESH_TOKEN_COOKIE_TTL, // 7 days
    });

    return {
      statusCode: HttpStatus.OK,
      accessToken: accessToken,
    };
  }

  signOut(res: Response) {
    res.clearCookie("access_token"); // This clears the cookie
    res.clearCookie("refresh_token"); // This clears the cookie

    return { statusCode: HttpStatus.OK };
  }
}
