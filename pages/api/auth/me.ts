// Crear endpoint seguro
import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { authTokenMiddleware } from "../../../lib/middlewares/token";
import { getMe } from "../../../lib/controllers/authorization";

async function postHandler(
  req: NextApiRequest,
  res: NextApiResponse,
  userdata
) {
  const userId = userdata.userId;
  const user = await getMe(userId);
  res.send(user);
}

const handler = methods({
  post: postHandler,
});

export default authTokenMiddleware(handler);
