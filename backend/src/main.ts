import { NestFactory } from "@nestjs/core";
import {
  BadRequestException,
  HttpStatus,
  ValidationPipe,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";

import { AppModule } from "./app.module";

import { ENV_DEV } from "./common/config/app.config";

import { PostgresExceptionFilter } from "./common/exceptions/filters/postgres-exception.filter";
import { HTTPExceptionFilter } from "./common/exceptions/filters/http-exception.filter";

import { TransformInterceptor } from "./common/interceptors/transform.interceptor";

import * as dotenv from "dotenv";
import * as path from "path";
import * as cookieParser from "cookie-parser";
import * as passport from "passport";
import helmet from "helmet";

// Load environment variables manually
dotenv.config({
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV || ENV_DEV}`),
});

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.use(cookieParser());

  // Initialize passport
  app.use(passport.initialize());

  // apply helmet middleware
  app.use(
    helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          scriptSrc: [
            "'self'",
            "'unsafe-inline'",
            "'unsafe-eval'",
            "cdn.vercel-insights.com",
          ],
          styleSrc: ["'self'", "'unsafe-inline'"],
          imgSrc: ["'self'", "data:"],
        },
      },
      crossOriginResourcePolicy: { policy: "same-origin" },
      referrerPolicy: { policy: "no-referrer" },
      crossOriginEmbedderPolicy: false, // May interfere with cross-origin loading
    }),
  );

  // Enable graceful shutdown hooks
  app.enableShutdownHooks();

  // apply cors
  app.enableCors({
    origin: [configService.get<string>("app.corsOrigins")], // Allow frontend (Next.js)
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true, // Allow cookies & authentication headers
  });

  // set global prefix for all routes
  app.setGlobalPrefix("api");

  // apply global validation pipe to handle request validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips properties that are not in the DTO
      forbidNonWhitelisted: true, // Throws an error if a non-whitelisted property is provided
      exceptionFactory: (errors) => {
        // You can format the error response here
        const response = errors.reduce((acc, error) => {
          const constraints = Object.values(error.constraints || {});
          return [...acc, ...constraints];
        }, []);

        return new BadRequestException({
          message: response,
          error: "Bad Request",
          statusCode: HttpStatus.BAD_REQUEST,
        });
      },
    }),
  );

  // apply global filter to catch Postgres exceptions
  app.useGlobalFilters(new PostgresExceptionFilter());

  // apply global filter to catch HTTP exceptions
  app.useGlobalFilters(new HTTPExceptionFilter());

  // apply global interceptor to transform responses
  app.useGlobalInterceptors(new TransformInterceptor());

  // Access environment variables using ConfigService
  const port = configService.get<number>("app.port") || 5001;

  await app.listen(port, "0.0.0.0"); // Listening on all network interfaces
  console.log(
    `🚀 Server running on http://localhost:${port} (ENV: ${process.env.NODE_ENV})`,
  );
}
void bootstrap();
