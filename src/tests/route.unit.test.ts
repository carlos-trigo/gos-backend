import { afterAll, beforeAll, expect, test } from "@jest/globals";
import { createErrorMiddleware } from "../util/error-middleware";
import express from "express";
import request from "supertest";
import http from "http";

import { BODY_LIMIT, NODE_ENV, PARAMETER_LIMIT } from "../constants";
import { DB } from "../db";
import { expressConfig } from "../util/express-config";
import { newRouter } from "../routes/index";

let app: express.Express;
let db: DB;
let server: http.Server;

beforeAll(async () => {
  app = express();
  expressConfig(app, {
    BODY_LIMIT,
    PARAMETER_LIMIT,
    NODE_ENV,
  });
  db = new DB();
  app.use(newRouter({ db }));
  const errorMiddleware = createErrorMiddleware();
  app.use(errorMiddleware);
  server = http.createServer(app);
});

afterAll(async () => {
  server.close();
});

test("/skaters", async () => {
  const ROUTE = "/skaters";
  const response = await request(app).get(ROUTE).send();
  expect(response.status).toBe(200);
});
