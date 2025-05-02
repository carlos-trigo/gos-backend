import { SkaterInsert } from "src/types";

export const getSkaterById = (id: string) => ({
  query: "SELECT * FROM skater WHERE id=$1",
  args: [id],
});

export const getSkaterByEmail = (email: string) => ({
  query: "SELECT * FROM skater WHERE email=$1",
  args: [email],
});

export const getSkaterIdByEmail = (email: string) => ({
  query: "SELECT id FROM skater WHERE email=$1",
  args: [email],
});

export const addSkater = (skater: SkaterInsert) => ({
  query: `INSERT INTO "skater" (name, email, picture, email_verified, auth0_sub) VALUES ($1, $2, $3, $4, $5)`,
  args: [
    skater.name,
    skater.email,
    skater.picture,
    skater.email_verified,
    skater.auth0_sub,
  ],
});

export const getAllSkaters = "SELECT * FROM skater ORDER BY created_at DESC";
