import type { NextApiRequest, NextApiResponse } from "next";
import methods from "micro-method-router";
import { authTokenMiddleware } from "../../../lib/middlewares/token";
import { getMe } from "../../../lib/controllers/authorization";
import { handleCreateOrder } from "../../../lib/controllers/order";
import { createPreference } from "../../../lib/connections/mercadopago";

const products = {
  1234: {
    title: "producto 1234",
    description: "Very rare an excentric product made of gold and diamonds",
    price: 155,
  },
};

async function handlePost(req, res, userId) {
  const user = await getMe(userId.userId);
  const productId = req.query.productId;
  if (!products[productId]) {
    res.status(404).send("Product not found");
  }
  const product = products[productId];
  // Here the order is created with a pending status
  const order = await handleCreateOrder({
    total_data: req.body,
    productId: productId,
    user_id: userId.userId,
    status: "pending",
  });

  const preference = await createPreference({
    external_reference: order.id,
    items: [
      {
        title: product.title,
        description: product.description,
        picture_url: "http://www.myapp.com/myimage.jpg",
        category_id: "car_electronics",
        quantity: 1,
        currency_id: "ARS",
        unit_price: product.price,
      },
    ],
    back_urls: { succes: "https://apx.school" },
  });
  res.send({ init_point: preference.init_point });
}

const handler = methods({
  post: handlePost,
});

export default authTokenMiddleware(handler);
