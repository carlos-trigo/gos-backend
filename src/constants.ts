import { info } from "console";
import { configDotenv } from "dotenv";
configDotenv();

// Postgres connection
export const DB_NAME: string = process.env.DB_NAME ?? "postgres";
export const DB_USER: string = process.env.DB_USER ?? "postgres";
export const DB_HOST: string = process.env.DB_HOST ?? "localhost";
export const DB_PASSWORD: string = process.env.DB_PASSWORD ?? "password";
export const DB_PORT: number = Number(process.env.DB_PORT) || 5432;
export const DB_URI_DIRECT: string = process.env.DB_URI_DIRECT;
export const DB_URI_POOLER: string = process.env.DB_URI_POOLER;

// Server config
export const CORS_ALLOWED_ORIGINS = JSON.parse(
  process.env.CORS_ALLOWED_ORIGINS
);
info("ALLOWED ORIGINS: ", CORS_ALLOWED_ORIGINS);
export const PORT: number = Number(process.env.PORT) || 8080;
export const NODE_ENV: string = process.env.NODE_ENV ?? "development";
export const BODY_LIMIT: string = process.env.BODY_LIMIT ?? "64kb";
export const PARAMETER_LIMIT: number =
  Number(process.env.PARAMETER_LIMIT) || 100;

// Auth0
export const AUTH0_DOMAIN = process.env.AUTH0_DOMAIN;
export const AUTH0_AUDIENCE = process.env.AUTH0_AUDIENCE;
export const AUTH0_CLIENT_ORIGIN_URL = process.env.AUTH0_CLIENT_ORIGIN_URL;

export const dataConstraints = {
  skater: {
    name: {
      max: 32,
      min: 3,
    },
    email: {
      regex: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    },
  },
};
