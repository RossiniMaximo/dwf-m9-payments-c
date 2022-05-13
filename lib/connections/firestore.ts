import admin from "firebase-admin";

const serviceAcc = JSON.parse(process.env.FIRESTORE_CONNECTION);

if (admin.apps.length == 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAcc),
  });
}
export const firestore = admin.firestore();
