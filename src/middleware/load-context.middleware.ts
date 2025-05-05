import { NextFunction, Request, Response } from "express";
import { DbConnection } from "src/db";
import { getSkaterByAuth0Sub } from "../db/queries/skater.query";

export const loadContext = async (connection: DbConnection) => {
  return async function (req: Request, res: Response, next: NextFunction) {
    const skater = await getSkaterByAuth0Sub(req.auth.payload.sub, connection);
    req.skater = skater;
    next();
  };
};
