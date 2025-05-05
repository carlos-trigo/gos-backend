import { SkaterInsert } from "src/types";
import { DbConnection } from "..";
import { tSkater, tSkaterCols } from "../tables";

export const getSkaterById = async (id: string, connection: DbConnection) =>
  connection
    .selectFrom(tSkater)
    .where(tSkater.id.equals(id))
    .select(tSkaterCols)
    .executeSelectNoneOrOne();

export const getSkaterByAuth0Sub = async (
  auth0_sub: string,
  connection: DbConnection
) =>
  connection
    .selectFrom(tSkater)
    .where(tSkater.auth0_sub.equals(auth0_sub))
    .select(tSkaterCols)
    .executeSelectNoneOrOne();

export const getSkaterByEmail = async (
  email: string,
  connection: DbConnection
) =>
  connection
    .selectFrom(tSkater)
    .where(tSkater.email.equals(email))
    .select(tSkaterCols)
    .executeSelectNoneOrOne();

export const getSkaterIdByEmail = async (
  email: string,
  connection: DbConnection
) =>
  connection
    .selectFrom(tSkater)
    .where(tSkater.email.equals(email))
    .selectOneColumn(tSkaterCols.id)
    .executeSelectNoneOrOne();

export const addSkater = async (
  skater: SkaterInsert,
  connection: DbConnection
) =>
  connection
    .insertInto(tSkater)
    .set({
      name: skater.name,
      email: skater.email,
      picture: skater.picture,
      email_verified: skater.email_verified,
      auth0_sub: skater.auth0_sub,
    })
    .returningLastInsertedId()
    .executeInsert();

export const getAllSkaters = "SELECT * FROM skater ORDER BY created_at DESC";
