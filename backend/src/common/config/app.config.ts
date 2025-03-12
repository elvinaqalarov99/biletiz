export const ENV_PROD = "production";
export const ENV_DEV = "development";
export const ENV_TEST = "testing";

export const RATE_LIMIT_TTL = 1;
export const RATE_LIMIT_LIMIT = 5;

export default () => ({
  app: {
    env: process.env.NODE_ENV || ENV_DEV,
    port: Number(process.env.PORT || ""),
    corsOrigins: process.env.CORS_ORIGINS || "*",
    isProduction: Boolean(process.env.NODE_ENV === ENV_PROD || false),
    isDevelopment: Boolean(process.env.NODE_ENV === ENV_DEV || false),
    isTesting: Boolean(process.env.NODE_ENV === ENV_TEST || false),
    rateLimitTtl: Number(process.env.RATE_LIMIT_TTL ?? RATE_LIMIT_TTL),
    rateLimitLimit: Number(process.env.RATE_LIMIT_LIMIT ?? RATE_LIMIT_LIMIT),
  },
});
