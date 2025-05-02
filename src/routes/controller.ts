import { RequestHandler } from "express";
import { DB } from "../db/index";
import { dataConstraints } from "../constants";
import { SkaterInsert } from "../types";
import { isBoolean, isValidString } from "./validation";
import { BadRequestError, NotFoundError } from "../util/errors";
import { log } from "console";

/** Handles express requests using db class */
export class Controller {
  db: DB;

  constructor(deps: { db: DB }) {
    this.db = deps.db;
  }

  GET_ALL: RequestHandler = async (req, res) => {
    const result = await this.db.getAllSkaters();
    res.status(200).send(result);
  };

  GET_BY_ID: RequestHandler = async (req, res) => {
    const parsedId = isValidString(req.params.id);
    const result = await this.db.getSkaterById(parsedId);
    if (!result)
      throw new NotFoundError(`No skaters found with ID ${parsedId}`);

    res.status(200).send(result);
  };

  GET_BY_EMAIL: RequestHandler = async (req, res) => {
    const parsedEmail = isValidString(
      req.params.email,
      undefined,
      dataConstraints.skater.email.regex
    );
    const result = await this.db.getSkaterByEmail(parsedEmail);
    if (!result)
      throw new NotFoundError(`No skaters found with email ${parsedEmail}`);

    res.status(200).send(result);
  };

  LOGIN: RequestHandler = async (req, res) => {
    const { name, email, email_verified, picture } = req.body;
    const auth0_sub = req.auth.payload.sub;
    if (!auth0_sub) throw new BadRequestError("Request is missing auth0_sub");
    if (
      name === undefined ||
      email === undefined ||
      email_verified === undefined
    )
      throw new BadRequestError("Request is missing param");

    const skater = await this.db.getSkaterByEmail(email);
    if (!skater) {
      const newSkater: SkaterInsert = {
        name: isValidString(name, dataConstraints.skater.name),
        email: isValidString(
          email,
          undefined,
          dataConstraints.skater.email.regex
        ),
        email_verified: isBoolean(email_verified),
        picture,
        auth0_sub,
      };
      console.log(JSON.stringify(skater));
      const result = await this.db.addSkater(newSkater);
      res.status(200).send(result.rows);
    }
    res.status(200).send(skater);
  };

  UI_ADD_FRIENDS: RequestHandler = async (req, res) => {
    const email = isValidString(
      req.params.email,
      undefined,
      dataConstraints.skater.email.regex
    );
    if (email === undefined)
      throw new BadRequestError("Request is missing name param");

    const skaterId = await this.db.getSkaterIdByEmail(email);
    if (!skaterId)
      throw new BadRequestError("We can't seem to find your profile");

    const currentFriends = await this.db.getFriends(skaterId);
    const pendingFriends = await this.db.getPendingFriendRequests(skaterId);
    const allSkaters = await this.db.getAllSkaters();

    const result = allSkaters.map((skater) => {
      if (currentFriends.includes(skater))
        skater.friendRequestStatus = "approved";
      else if (pendingFriends.includes(skater))
        skater.friendRequestStatus = "pending";
      else skater.friendRequestStatus = "none";
      return skater;
    });

    res.status(200).send(result);
  };

  PROCESS_FRIEND_REQUEST: RequestHandler = async (req, res) => {
    const { requesterEmail, targetId: target_id } = req.body;

    if (requesterEmail === undefined || target_id === undefined)
      throw new BadRequestError("Request is missing name param");

    const requester_id = await this.db.getSkaterIdByEmail(requesterEmail);

    const result = await this.db.processFriendRequest(requester_id, target_id);

    res.status(200).send(result);
  };
}
