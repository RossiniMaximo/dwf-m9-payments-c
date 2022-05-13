import { Order } from "../models/order";

export async function handleCreateOrder(data: any) {
  const order = await Order.create(data);
  return order;
}
