import { Client, Pool, QueryResult } from "pg";
import { DB_HOST, DB_URI_POOLER, DB_URI_DIRECT } from "../constants";
import { Skater, SkaterInsert } from "../types";
import { PgPoolQueryRunner } from "ts-sql-query/queryRunners/PgPoolQueryRunner";

import {
  addSkater,
  getAllSkaters,
  getSkaterByEmail,
  getSkaterById,
  getSkaterIdByEmail,
} from "./queries/skater.query";
import {
  acceptFriendRequest,
  addFriendRequest,
  getFriendsById,
  getPendingFriendRequests,
  rejectFriendRequest,
} from "./queries/skater-connection.query";
import {
  isSkater,
  isSkaterArray,
  isSkaterConnectionArray,
  isValidString,
} from "../routes/validation";
import { PostgreSqlConnection } from "ts-sql-query/connections/PostgreSqlConnection";

export class DbConnection extends PostgreSqlConnection<"DBConnection"> {}
export class DB {
  client: Client;
  pool: Pool;
  connection;

  constructor() {
    console.info("Creating db instance...");
    this.client = new Client({ connectionString: DB_URI_DIRECT });
    this.pool = new Pool({ connectionString: DB_URI_POOLER });
    this.connection = new DbConnection(new PgPoolQueryRunner(this.pool));
    console.info("Db connected: ", DB_HOST);
  }

  async getAllSkaters() {
    console.info(`Getting all skaters`);

    const allSkater = (await this.pool.query(getAllSkaters)).rows;

    if (allSkater && isSkaterArray(allSkater)) return allSkater;
    throw new Error(
      "Cannot get all skaters: invalid type returned by the database"
    );
  }

  async getSkaterById(id: string) {
    console.info(`Getting skater by id: [${id}]`);

    const skater = getSkaterById(id, this.connection);

    if (skater && isSkater(skater)) return skater;
    throw new Error(
      "Cannot get skater by email: invalid type returned by the database - " +
        id
    );
  }

  async getSkaterByEmail(email: string) {
    console.info(`Getting skater by email: [${email}]`);

    const skater = getSkaterByEmail(email, this.connection);

    if ((skater && isSkater(skater)) || !skater) return skater;
    throw new Error(
      "Cannot get skater by email: invalid type returned by the database - " +
        email
    );
  }

  async getSkaterIdByEmail(email: string): Promise<string> {
    console.info(`Getting skater by name: [${email}]`);

    const skaterId = getSkaterIdByEmail(email, this.connection);

    if (skaterId && isValidString(skaterId)) return skaterId;
    throw new Error(
      "Cannot get skater id by email: invalid type returned by the database - " +
        email
    );
  }

  async getFriends(id: string) {
    console.info(`Getting friends: [${id}]`);

    const friends = await getFriendsById(id, this.connection);

    if (friends && isSkaterArray(friends)) return friends;
    throw new Error(
      "Cannot get skater friends: invalid type returned by the database - " + id
    );
  }

  async addSkater(skater: SkaterInsert) {
    console.info(`Creating new skater: [${JSON.stringify(skater)}]`);

    return addSkater(skater, this.connection);
  }

  async getPendingFriendRequests(skaterId: string) {
    console.info(`Getting pending friend requests for skater: [${skaterId}]`);

    const pendingFriendRequests = await getPendingFriendRequests(
      skaterId,
      this.connection
    );

    if (pendingFriendRequests && isSkaterConnectionArray(pendingFriendRequests))
      return pendingFriendRequests;
    throw new Error(
      "Cannot get pending friend requests: invalid type returned by the database - " +
        skaterId
    );
  }

  async processFriendRequest(requesterId: string, targetId: string) {
    console.info(
      `Processing friend request from ${requesterId} for ${targetId}`
    );

    return await addFriendRequest(requesterId, targetId, this.connection);
  }

  async acceptFriendRequest(requesterId: string, targetId: string) {
    console.info(
      `Accepting friend request from ${requesterId} for ${targetId}`
    );

    return await acceptFriendRequest(requesterId, targetId, this.connection);
  }

  async rejectFriendRequest(requesterId: string, targetId: string) {
    console.info(
      `Rejecting friend request from ${requesterId} for ${targetId}`
    );

    return await rejectFriendRequest(requesterId, targetId, this.connection);
  }

  async close() {
    console.info("Closing DB connection...");
    await this.client.end();
    await this.pool.end();
    console.info("DB connection closed");
  }
}
