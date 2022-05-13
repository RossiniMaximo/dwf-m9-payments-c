import { Auth } from "../models/auth";
import { User } from "../models/user";
import addMinutes from "date-fns/addMinutes";
import getRandom from "get-random";
const random = getRandom(10000, 99999);

async function findOrCreateAuth(email: string) {
  const result = await Auth.findEmail(email);

  if (result) {
    return result;
  } else {
    //   create user and user user's id to create an auth for that user
    const user = await User.create(email);
    if (user) {
      const auth = await Auth.create({
        email: email,
        createdAt: new Date(),
        code: null,
        expiration: null,
        userId: user.id,
      });
      if (auth) {
        return auth;
      }
    }
  }
}

export async function sendCode(email: string) {
  const cleanEmail = email.trim().toLowerCase();
  const now = new Date();
  const expiration = addMinutes(now, 20);
  const auth = await findOrCreateAuth(cleanEmail);

  if (auth) {
    auth.data = {
      email: cleanEmail,
      code: random,
      expiration: expiration,
    };
    await auth.push();

    console.log(
      "EMAIL FROM APP",
      "CODE :" + " " + auth.data.code,
      "EXPIRATION :" + " " + auth.data.expiration.toDateString()
    );
  }
  return auth.data;
}

export async function getMe(userId) {
  const user = new User(userId);
  await user.pull();
  return { data: user.data };
}
