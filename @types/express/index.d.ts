import * as express from "express";
import { Skater } from "../../src/types";

declare global {
  namespace Express {
    export interface Request {
      skater?: Skater;
    }
  }
}
