import express from "express";
import { DB } from "../db";
import { Controller } from "./controller";

export const newRouter = (deps: { db: DB }) => {
  const controller = new Controller(deps);

  const router = express.Router();

  router.post(`/auth`, controller.LOGIN);

  router.get(`/skaters`, controller.GET_ALL);
  router.get(`/skater/:id`, controller.GET_BY_ID);
  router.get(`/skater/:email`, controller.GET_BY_EMAIL);

  router.get(`/friends/:email`, controller.GET_BY_EMAIL);

  router.get(`/ui/add-friends`, controller.UI_ADD_FRIENDS);

  router.put("/add-friend/:id", controller.PROCESS_FRIEND_REQUEST);
  router.put("/friend-request/accept/:id", controller.ACCEPT_FRIEND_REQUEST);
  router.put("/friend-request/reject/:id", controller.REJECT_FRIEND_REQUEST);

  return router;
};
