export interface Skater {
  id: string;
  name: string;
  email: string;
  picture: string;
  email_verified: boolean;
  created_at: Date;
  updated_at: Date;

  friendRequestStatus?: "approved" | "pending" | "rejected" | "none";
}

export interface SkaterInsert {
  name: string;
  email: string;
  picture: string;
  email_verified: boolean;
}

export interface SkaterConnection {
  id: string;
  skater_a: string;
  skater_b: string;
  requested_by: string;
  requested_at: string;
  type: SkaterConnectionType;
  approved: boolean;
  approved_at: Date;
  rejected: boolean;
  rejected_at: Date;
}

export type SkaterConnectionType = "friend" | "block" | "archnemesis";
