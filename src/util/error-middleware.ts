import { ErrorRequestHandler } from "express";
import { ERRORS } from "./errors";

/** Handles API errors, returning the appropriate status code based on the error thrown */
export const createErrorMiddleware = (): ErrorRequestHandler => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (err, _req, res, next) => {
    console.error(err);

    for (const Error of ERRORS) {
      if (err instanceof Error) {
        res.status(err.code).send({ message: err.message });
        return;
      }
    }

    res.status(500).send({ message: "An internal error occurred" });
  };
};
