import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Res,
  Req,
  UseGuards,
  UnauthorizedException,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { UserLoginDto } from "src/modules/users/dto/user-login.dto";
import { Request, Response } from "express";
import { JwtAuthGuard } from "./jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  async signIn(
    @Req() req: Request,
    @Res() res: Response,
    @Body() userLoginDto: UserLoginDto,
  ) {
    if (req.cookies?.refresh_token as string) {
      return res.status(HttpStatus.FORBIDDEN).json({
        statusCode: HttpStatus.FORBIDDEN,
        message: "You are logged in",
      });
    }

    const resData = await this.authService.signIn(
      res,
      userLoginDto.email,
      userLoginDto.password,
    );

    return res.status(resData.statusCode).json(resData);
  }

  // Refresh Access Token route
  @Post("refresh-token")
  refresh(@Req() req: Request, @Res() res: Response) {
    const refreshToken = req.cookies?.refresh_token as string; // Get refresh token from cookies

    if (!refreshToken) {
      throw new UnauthorizedException("Refresh token is required");
    }

    this.authService.refreshToken(res, refreshToken);

    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Post("logout")
  signOut(@Res() res: Response) {
    const resData = this.authService.signOut(res);

    return res.status(resData.statusCode).json(resData);
  }

  @UseGuards(JwtAuthGuard)
  @Post("me")
  getMe(@Req() req: Request, @Res() res: Response) {
    return res.status(HttpStatus.OK).json({
      statusCode: HttpStatus.OK,
      user: req.user,
    });
  }
}
