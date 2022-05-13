import { sendCode } from "../../../lib/controllers/authorization";
import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { email } = req.body;
  const result = await sendCode(email);
  res.send(result);
}

const handler = methods({
  post: postHandler,
});

export default handler;
