import methods from "micro-method-router";
import type { NextApiRequest, NextApiResponse } from "next";
import { Auth } from "../../../lib/models/auth";
import { createToken } from "../../../lib/jwt";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { email, code } = req.body;
  const auth = await Auth.findByEmailAndCode(email, code);
  const expirated = Auth.checkExpiration(auth.data.expiration);
  if (expirated) {
    res
      .status(401)
      .send(
        "code expired , please generate another one.Remember that  they expire after 20 minutes of being created"
      );
  }
  const token = createToken({ userId: auth.data.userId });
  res.send({ token });
}

export default methods({
  post: postHandler,
});
