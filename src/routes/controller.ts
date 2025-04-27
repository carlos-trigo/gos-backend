import { RequestHandler } from "express";
import { DB } from "../db/index";
import { dataConstraints } from "../constants";
import { SkaterInsert } from "../types";
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
    res.status(200).send(result.rows);
  };

  GET_BY_ID: RequestHandler = async (req, res) => {
    const parsedId = isValidString(req.params.id);
    const result = await this.db.getSkaterById(parsedId);
    if (!result)
      throw new NotFoundError(`No skaters found with ID ${parsedId}`);

    res.status(200).send(result);
  };

  GET_BY_NAME: RequestHandler = async (req, res) => {
    const parsedName = isValidString(req.params.name);
    const result = await this.db.getSkaterByName(parsedName);
    if (!result)
      throw new NotFoundError(`No skaters found with name ${parsedName}`);

    res.status(200).send(result);
  };

  USER: RequestHandler = async (req, res) => {
    const { name, email, email_verified, picture } = req.body;
    if (!(name && email && email_verified))
      throw new BadRequestError("Request is missing param");

    const skater = await this.db.getSkaterByName(name);

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
  };
}
