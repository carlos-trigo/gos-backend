import { DbConnection } from "..";
import { SKATER_CONNECTION_TYPE } from "../../constants";
import {
  tSkaterConnectionCols,
  tSkaterConnection,
  tSkater,
  tSkaterCols,
} from "../tables";

export const getAllConnections = (id: string, connection: DbConnection) =>
  connection
    .selectFrom(tSkaterConnection)
    .where(
      tSkaterConnection.skater_a
        .equals(id)
        .or(tSkaterConnection.skater_b.equals(id))
    )
    .select(tSkaterConnectionCols)
    .executeSelectMany();

export const getFriendsById = (id: string, connection: DbConnection) =>
  connection
    .selectFrom(tSkaterConnection)
    .innerJoin(tSkater)
    .on(
      tSkater.id
        .equals(tSkaterConnection.skater_a)
        .or(tSkater.id.equals(tSkaterConnection.skater_b))
    )
    .where(tSkaterConnection.type.equals(SKATER_CONNECTION_TYPE.friend))
    .and(
      tSkaterConnection.skater_a
        .equals(id)
        .or(tSkaterConnection.skater_b.equals(id))
    )
    .and(tSkaterConnection.approved.equals(true))
    .select({ ...tSkaterConnectionCols, ...tSkaterCols })
    .executeSelectMany();

export const getPendingFriendRequests = (
  id: string,
  connection: DbConnection
) =>
  connection
    .selectFrom(tSkaterConnection)
    .innerJoin(tSkater)
    .on(
      tSkater.id
        .equals(tSkaterConnection.skater_a)
        .or(tSkater.id.equals(tSkaterConnection.skater_b))
    )
    .where(tSkaterConnection.type.equals(SKATER_CONNECTION_TYPE.friend))
    .and(
      tSkaterConnection.skater_a
        .equals(id)
        .or(tSkaterConnection.skater_b.equals(id))
    )
    .and(tSkaterConnection.approved.equals(false))
    .and(tSkaterConnection.rejected.equals(false))
    .select({
      ...tSkaterConnectionCols,
      ...tSkaterCols,
    })
    .executeSelectMany();

export const addFriendRequest = async (
  requesterId: string,
  targetId: string,
  connection: DbConnection
) => {
  // TODO: VALIDATION: check requester is not blocked by target

  return await connection
    .insertInto(tSkaterConnection)
    .set({
      skater_a: requesterId,
      skater_b: targetId,
      type: SKATER_CONNECTION_TYPE.friend,
      requested_by: requesterId,
    })
    .returningLastInsertedId()
    .executeInsert();
};

export const acceptFriendRequest = async (
  requesterId: string,
  targetId: string,
  connection: DbConnection
) => {
  return await connection
    .update(tSkaterConnection)
    .set({
      approved: true,
      approved_at: new Date(),
    })
    .where(tSkaterConnection.skater_a.equals(requesterId))
    .and(tSkaterConnection.skater_b.equals(targetId))
    .executeUpdate();
};

export const rejectFriendRequest = async (
  requesterId: string,
  targetId: string,
  connection: DbConnection
) => {
  return await connection
    .update(tSkaterConnection)
    .set({
      rejected: true,
      rejected_at: new Date(),
    })
    .where(tSkaterConnection.skater_a.equals(requesterId))
    .and(tSkaterConnection.skater_b.equals(targetId))
    .executeUpdate();
};

export const removeFriend = async (
  requesterId: string,
  targetId: string,
  connection: DbConnection
) => {
  // TODO: implement
  return await connection
    .update(tSkaterConnection)
    .set({
      rejected: true,
      rejected_at: new Date(),
    })
    .where(tSkaterConnection.skater_a.equals(requesterId))
    .and(tSkaterConnection.skater_b.equals(targetId))
    .executeUpdate();
};
