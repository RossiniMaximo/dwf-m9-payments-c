import jwt from "jsonwebtoken";

export function createToken(data) {
  return jwt.sign(data, process.env.JWT_TOKEN);
}

export function decode(token) {
  try {
    return jwt.verify(token, process.env.JWT_TOKEN);
  } catch (error) {
    console.error({ error });
  }
}
