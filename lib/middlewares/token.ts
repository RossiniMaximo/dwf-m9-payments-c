import type { NextApiRequest, NextApiResponse } from "next";
import { decode } from "../jwt";

export function authTokenMiddleware(callback) {
  return function (req: NextApiRequest, res: NextApiResponse) {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      res.status(403).send({ error: "Token needed" });
    }
    const checkToken = decode(token);
    if (checkToken) {
      callback(req, res, checkToken);
    }
  };
}
