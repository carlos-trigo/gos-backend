import { Client, Pool } from "pg";
import { DB_HOST, DB_URI_POOLER, DB_URI_DIRECT } from "../constants";
import { Skater, SkaterInsert } from "../types";
import {
  getAllSkaters,
  getFriendsByEmail,
  getSkaterByEmail,
  getSkaterById,
} from "./queries/skater.query";

export class DB {
  client: Client;
  pool: Pool;

  constructor() {
    console.info("Creating db instance...");
    this.client = new Client({ connectionString: DB_URI_DIRECT });
    this.pool = new Pool({ connectionString: DB_URI_POOLER });
    console.info("Db connected: ", DB_HOST);
  }

  async getAllSkaters() {
    console.info(`Getting all skaters`);

    return await this.pool.query(getAllSkaters);
  }

  async getSkaterById(id: string) {
    console.info(`Getting skater by id: [${id}]`);

    const { query, args } = getSkaterById(id);
    return (await this.pool.query<Skater>(query, args)).rows[0];
  }

  async getSkaterByEmail(name: string) {
    console.info(`Getting skater by name: [${name}]`);

    const { query, args } = getSkaterByEmail(name);
    return (await this.pool.query<Skater>(query, args)).rows[0];
  }

  async getFriends(email: string) {
    console.info(`Getting friends: [${email}]`);

    const { query, args } = getFriendsByEmail(email);
    return (await this.pool.query<Skater>(query, args)).rows[0];
  }

  async addSkater(skater: SkaterInsert) {
    console.info(`Creating new skater: [${JSON.stringify(skater)}]`);

    const { name, email, picture, email_verified } = skater;
    return await this.pool.query(
      `INSERT INTO "skater" (name, email, picture, email_verified) VALUES ($1, $2, $3, $4)`,
      [name, email, picture, email_verified]
    );
  }

  async close() {
    console.info("Closing DB connection...");
    await this.client.end();
    await this.pool.end();
    console.info("DB connection closed");
  }
}
