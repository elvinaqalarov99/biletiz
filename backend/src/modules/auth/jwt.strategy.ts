import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "./interfaces/jwt-payload.interface";
import { UserService } from "../users/user.service";
import { UserEntity } from "../../common/entities/user.entity";
import { ConfigService } from "@nestjs/config";
import { Request } from "express";

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    configService: ConfigService,
    private userService: UserService,
  ) {
    const jwtSecret = configService.get<string>("jwt.secret");

    if (!jwtSecret) {
      throw new Error(
        "JWT_SECRET is not defined in the environment variables!",
      );
    }

    const options = {
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          // Extract token from cookies
          const token = request?.cookies?.access_token;

          if (!token) {
            throw new UnauthorizedException();
          }

          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: jwtSecret,
    };

    super(options);
  }

  async validate(payload: JwtPayload): Promise<UserEntity | null> {
    return await this.userService.findOne({ id: payload.sub });
  }
}
