import express from "express";
import { DB } from "../db";
import { Controller } from "./controller";

export const newRouter = (deps: { db: DB }) => {
  const controller = new Controller(deps);

  const router = express.Router();

  router.get(`/skaters`, controller.GET_ALL);
  router.get(`/skater/:id`, controller.GET_BY_ID);
  router.get(`/skater/:name`, controller.GET_BY_NAME);

  router.post(`/user`, controller.USER);

  return router;
};
