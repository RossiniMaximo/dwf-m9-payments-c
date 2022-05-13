import { firestore } from "../connections/firestore";

const collection = firestore.collection("orders");

export class Order {
  id: string;
  data: any;
  ref: FirebaseFirestore.DocumentReference;
  constructor(id) {
    this.id = id;
    this.ref = collection.doc(id);
  }
  async pull() {
    const datasnap = await this.ref.get();
    this.data = datasnap.data();
  }
  async push() {
    await this.ref.update(this.data);
  }
  static async create(data) {
    const snap = await collection.add(data);
    const order = new Order(snap.id);
    order.data = data;
    return order;
  }
}
