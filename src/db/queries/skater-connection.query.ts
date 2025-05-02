import { SKATER_CONNECTION_TYPE } from "../../constants";

export const getAllConnections = (id: string) => ({
  query:
    "SELECT * FROM skater_connection WHERE (skater_a=$1 OR skater_b=$1) ORDER BY requested_at DESC",
  args: [id],
});

export const getFriendsById = (id: string) => ({
  query: `SELECT * FROM skater_connection WHERE (skater_a=$1 OR skater_b=$1) AND approved=TRUE AND type=$2 ORDER BY requested_at DESC`,
  args: [id, "friend"],
});

export const getPendingFriendRequests = (id: string) => ({
  query: `SELECT * FROM skater_connection WHERE (skater_a=$1 OR skater_b=$1) AND approved=false AND rejected=false AND type=$2 AND requested_by=$1 ORDER BY requested_at DESC`,
  args: [id, "friend"],
});
