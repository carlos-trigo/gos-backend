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
    res.status(200).send(result.rows);
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
    if (
      name === undefined ||
      email === undefined ||
      email_verified === undefined
    )
      throw new BadRequestError("Request is missing name param");

    const skater = await this.db.getSkaterByEmail(name);
    log(skater);
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
      };
      const result = await this.db.addSkater(newSkater);
      res.status(200).send(result.rows);
    }
    res.status(200).send(skater);
  };
}
