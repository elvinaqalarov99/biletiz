import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { ScheduleModule } from "@nestjs/schedule";

import { TypeOrmModule } from "@nestjs/typeorm";
import { UserModule } from "./modules/users/user.module";
import { RoleModule } from "./modules/roles/role.module";
import { ThrottlerModule } from "@nestjs/throttler";
import { RbacModule } from "./core/rbac/rbac.module";
import { PermissionModule } from "./modules/permissions/permission.module";
import { AuthModule } from "./modules/auth/auth.module";

import { AppController } from "./app.controller";
import { AppService } from "./app.service";

import appConfig, { ENV_DEV } from "./common/config/app.config";
import databaseConfig from "./common/config/database.config";
import jwtConfig from "./common/config/jwt.config";

import { WorkerModule } from "./core/worker/worker.module";

import * as path from "path";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

const envFilePath = path.resolve(
  __dirname,
  `../.env.${process.env.NODE_ENV || ENV_DEV}`,
);

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      envFilePath: envFilePath,
      load: [appConfig, databaseConfig, jwtConfig], // Load multiple configs
      isGlobal: true, // Makes env variables available globally
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        throttlers: [
          {
            ttl: configService.get<number>("app.rateLimitTtl", 1),
            limit: configService.get<number>("app.rateLimitLimit", 5),
          },
        ],
      }),
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService], // ✅ Inject ConfigModule
      useFactory: (configService: ConfigService) => ({
        type: "postgres",
        host: configService.get<string>("database.host"),
        port: configService.get<number>("database.port"),
        username: configService.get<string>("database.user"),
        password: configService.get<string>("database.pass"),
        database: configService.get<string>("database.name"),
        autoLoadEntities: true, // Enable only in development
        synchronize: false,
        namingStrategy: new SnakeNamingStrategy(),
        extra: {
          max: 10,
          idleTimeoutMillis: 30000,
        },
        logging: configService.get<boolean>("app.isDevelopment"), // Enable only in development
        migrations: [__dirname + "common/migrations/*.ts"], // Path to your compiled migration files
        migrationsTableName: "migrations", // Optional: specify table name for migrations
        cli: {
          migrationsDir: "common/migrations", // Path to your migration source files
        },
      }),
    }),
    AuthModule,
    UserModule,
    RoleModule,
    PermissionModule,
    RbacModule,
    WorkerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
