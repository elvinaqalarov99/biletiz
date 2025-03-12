// File to create a connection to the database using TypeORM for migrations
import { DataSource } from "typeorm";

import * as dotenv from "dotenv";
import * as path from "path";
import { ENV_DEV } from "./common/config/app.config";
import { SnakeNamingStrategy } from "typeorm-naming-strategies";

// Load environment variables manually
dotenv.config({
  path: path.resolve(__dirname, `../.env.${process.env.NODE_ENV || ENV_DEV}`),
});

export const AppDataSource = new DataSource({
  type: "postgres", // database type
  host: process.env.DB_HOST, //  database host
  port: parseInt(process.env.DB_PORT || "", 10), // database port
  username: process.env.DB_USER, // database username
  password: process.env.DB_PASS, // database password
  database: process.env.DB_NAME, // database name
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy(),
  logging: true, // optional
  entities: [path.resolve(__dirname + "/**/*.entity{.ts,.js}")],
  migrations: [path.resolve(__dirname + "/common/migrations/*{.ts,.js}")],
  subscribers: [],
});
