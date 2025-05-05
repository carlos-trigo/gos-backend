import { RequestHandler } from "express";
import { DB } from "../db/index";
import { dataConstraints } from "../constants";
import { Skater, SkaterInsert } from "../types";
import { isBoolean, isValidString } from "./validation";
import { BadRequestError, NotFoundError } from "../util/errors";

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
      res.status(200).send(result);
    }
    res.status(200).send(skater);
  };

  UI_ADD_FRIENDS: RequestHandler = async (req, res) => {
    if (!req.skater)
      throw new BadRequestError("We can't seem to find your profile");

    const { id: skaterId } = req.skater;
    const currentFriends = (await this.db.getFriends(skaterId)).map(
      (skater) => ({ ...skater, friendRequestStatus: "approved" })
    );
    const pendingFriends = (
      await this.db.getPendingFriendRequests(skaterId)
    ).map((skater) => ({ ...skater, friendRequestStatus: "pending" }));
    const allSkaters = await this.db.getAllSkaters();

    const processedSkaters = allSkaters.map((skater) => {
      const skaterWithStatus = { ...skater, friendRequestStatus: "none" };
      if (
        pendingFriends.some(
          (friend) => friend.id === skater.id //|| friend.skater_b === skater.id
        )
      ) {
        skaterWithStatus.friendRequestStatus = "pending";
      }
      if (
        currentFriends.some(
          (friend) => friend.id === skater.id //|| friend.skater_b === skater.id
        )
      ) {
        skaterWithStatus.friendRequestStatus = "approved";
      }
      return skaterWithStatus;
    });

    res.status(200).send({
      friends: currentFriends,
      pendingFriends,
      allSkaters: processedSkaters,
    });
  };

  PROCESS_FRIEND_REQUEST: RequestHandler = async (req, res) => {
    if (!req.skater.id)
      throw new BadRequestError("We can't seem to find your profile");

    const { id: target_id } = req.params;
    const { id: requester_id } = req.skater;

    if (target_id === undefined)
      throw new BadRequestError("Request is missing id param");

    const result = await this.db.processFriendRequest(requester_id, target_id);

    res.status(200).send(result);
  };

  ACCEPT_FRIEND_REQUEST: RequestHandler = async (req, res) => {
    if (!req.skater)
      throw new BadRequestError("We can't seem to find your profile");

    const { id: target_id } = req.params;
    const { id: requester_id } = req.skater;

    if (target_id === undefined)
      throw new BadRequestError("Request is missing id param");

    const result = await this.db.acceptFriendRequest(requester_id, target_id);

    res.status(200).send(result);
  };

  REJECT_FRIEND_REQUEST: RequestHandler = async (req, res) => {
    if (!req.skater)
      throw new BadRequestError("We can't seem to find your profile");

    const { id: target_id } = req.params;
    const { id: requester_id } = req.skater;

    if (target_id === undefined)
      throw new BadRequestError("Request is missing id param");

    const result = await this.db.rejectFriendRequest(requester_id, target_id);

    res.status(200).send(result);
  };
}
