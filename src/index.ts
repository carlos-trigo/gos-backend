import express from "express";
import http from "http";
import {
  PORT,
  BODY_LIMIT,
  NODE_ENV,
  PARAMETER_LIMIT,
  AUTH0_CLIENT_ORIGIN_URL,
  CORS_ALLOWED_ORIGINS,
} from "./constants";
import { DB } from "./db";
import { newRouter } from "./routes";
import { createErrorMiddleware } from "./util/error-middleware";
import { expressConfig } from "./util/express-config";
import cors from "cors";
import { validateAccessToken } from "./middleware/validate-access-token.middleware";

const shutdown =
  (deps: { server: http.Server; db: DB }) => async (): Promise<void> => {
    const { server, db } = deps;
    console.info(`Stopping server`);
    server.close();
    await db.close();
    console.info(`Service stopped`);
  };

/** Entry point */
const startup = async () => {
  console.info(`Initializing express...`);
  const app = express();
  expressConfig(app, {
    BODY_LIMIT,
    PARAMETER_LIMIT,
    NODE_ENV,
  });

  const db = new DB();
  app.set("trust proxy", 1);
  app.use(
    cors({
      origin: CORS_ALLOWED_ORIGINS,
      methods: ["GET", "POST", "PUT"],
      allowedHeaders: ["Authorization", "Content-Type"],
      maxAge: 86400,
    })
  );

  app.use(validateAccessToken);
  app.use(newRouter({ db }));

  const errorMiddleware = createErrorMiddleware();
  app.use(errorMiddleware);

  const server = http.createServer(app);

  // Avoid crashing the app on unhandled rejections/uncaught exceptions
  process.on("unhandledRejection", (err) => {
    console.error("unhandledRejection:", err);
  });
  process.on("uncaughtException", (err) => {
    console.error(`uncaughtException ${err.stack}`);
  });

  process.on("SIGTERM", shutdown({ server, db }));
  process.on("SIGINT", shutdown({ server, db }));

  server.listen(PORT, "0.0.0.0", () => {
    console.info(`Service started: listening on port ${PORT}`);
  });
};

startup();
