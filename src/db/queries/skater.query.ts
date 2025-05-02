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
  query: `INSERT INTO "skater" (name, email, picture, email_verified) VALUES ($1, $2, $3, $4)`,
  args: [skater.name, skater.email, skater.picture, skater.email_verified],
});

export const getAllSkaters = "SELECT * FROM skater ORDER BY created_at DESC";
