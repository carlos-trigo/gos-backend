import { Skater, SkaterConnection } from "src/types";

/**
 * Ensures unknown value is of type string
 * (Optionally validate constraints when provided)
 */
export const isValidString = (
  value: unknown,
  constraints?: { min: number; max: number },
  regex?: RegExp
): string => {
  if (typeof value !== "string") throw new Error(`${value} must be a string`);
  if (constraints) {
    if (value.length > constraints.max || value.length < constraints.min)
      throw new Error(
        `${value} does not satisfy length constraints (${constraints.min}-${constraints.max})`
      );
  }
  if (regex && !regex.test(value))
    throw new Error(`Invalid string value: ${value}`);
  return value;
};

export const isBoolean = (value: unknown) => {
  if ("boolean" === typeof value) return value;
  throw new Error(`${value} must be of type boolean`);
};

export const isValidEmail = (email: string) => {
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailPattern.test(email);
};

export const isSkater = (value: any): value is Skater => {
  const expectedProperties = ["id", "name", "email", "picture", "created_at"];
  expectedProperties.forEach((key) => {
    if (value[key] !== undefined) return false;
  });

  return true;
};

export const isSkaterArray = (value: any): value is Skater[] => {
  if (Array.isArray(value)) {
    value.forEach((entry) => {
      if (!isSkater(entry)) return false;
    });
  }

  return true;
};

export const isSkaterConnection = (value: any): value is SkaterConnection => {
  const expectedProperties = [
    "id",
    "skater_a",
    "skater_b",
    "requested_by",
    "requested_at",
    "type",
    "approved",
    "rejected",
    "approved_at",
    "rejected_at",
  ];
  expectedProperties.forEach((key) => {
    if (value[key] !== undefined) return false;
  });

  return true;
};

export const isSkaterConnectionArray = (value: any): value is Skater[] => {
  if (Array.isArray(value)) {
    value.forEach((entry) => {
      if (!isSkaterConnection(entry)) return false;
    });
  }

  return true;
};
