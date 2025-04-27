export interface Skater {
  id: string;
  name: string;
  email: string;
  picture: string;
  email_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SkaterInsert {
  name: string;
  email: string;
  picture: string;
  email_verified: boolean;
}
