import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { getMerchantOrder } from "../../../lib/connections/mercadopago";
import { handleCreateOrder } from "../../../lib/controllers/order";

async function postHandler(req: NextApiRequest, res: NextApiResponse) {
  const { id, topic } = req.query;
  if (topic == "merchant_order") {
    const order = await getMerchantOrder(id);
    if (order.order_status == "paid") {
      const orderId = order.external_reference;
      const newOrder = await handleCreateOrder(orderId);
      await newOrder.pull();
      newOrder.data.status = "closed";
      await newOrder.push();
      //   send emails to buyer and seller
    }
  }
}

const handler = methods({
  post: postHandler,
});

export default handler;
