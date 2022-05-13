import { firestore } from "../connections/firestore";

const collection = firestore.collection("users");

export class User {
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
  static async create(data) {
    const usersnapshot = await collection.add({ data });
    const user = new User(usersnapshot.id);
    user.data = data;
    return user;
  }
}
