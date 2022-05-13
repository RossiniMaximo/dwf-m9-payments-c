import { firestore } from "../connections/firestore";
import isAfter from "date-fns/isAfter";

const collection = firestore.collection("auth");

export class Auth {
  id: string;
  data: any;
  ref: FirebaseFirestore.DocumentReference;
  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
  }
  async push() {
    return await this.ref.update(this.data);
  }
  async pull() {
    const ref = await this.ref.get();
    const refData = ref.data();
    return (this.data = refData.data);
  }
  static checkExpiration(expiration) {
    const now = new Date();
    return isAfter(now, expiration);
  }
  static async findEmail(email: string) {
    const cleanEmail = email.trim().toLowerCase();
    const result = await collection.where("email", "==", cleanEmail).get();
    if (result.docs.length > 0) {
      const id = result.docs[0].id;
      const auth = new Auth(id);
      auth.data = result.docs[0].data();
      return auth;
    } else {
      return false;
    }
  }
  static async create(data) {
    const authsnapshot = await collection.add(data);
    const auth = new Auth(authsnapshot.id);
    auth.data = data;
    return auth;
  }
  static async findByEmailAndCode(email: string, code: number) {
    const cleanEmail = email.trim().toLowerCase();
    const result = await collection
      .where("email", "==", cleanEmail)
      .where("code", "==", code)
      .get();
    if (result.empty) {
      console.error("empty result");
    } else {
      const docSnap = result.docs[0];
      const auth = new Auth(docSnap.id);
      auth.data = docSnap.data();
      return auth;
    }
  }
}
