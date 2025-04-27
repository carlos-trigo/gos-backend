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
