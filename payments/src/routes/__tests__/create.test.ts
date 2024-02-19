import { Types } from "mongoose";
import request from "supertest";
import { randomBytes } from "crypto";

import { OrderStatus } from "@tazaker/common";

import { app } from "../../app";
import { signIn } from "../../test/global";
import { Order } from "../../models/order";
import { Payment } from "../../models/payment";

it("returns a 404 when purchasing an order that does not exist", async () => {
  return request(app)
    .post("/api/payments")
    .set("Cookie", signIn())
    .send({
      orderId: new Types.ObjectId().toHexString(),
      paypalOrderId: "fake_order",
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId: new Types.ObjectId().toHexString(),
    eventEnd: new Date(new Date().getTime() + 60000),
    price: 10,
    status: OrderStatus.Created,
    version: 0,
  });
  await order.save();

  return request(app)
    .post("/api/payments")
    .set("Cookie", signIn())
    .send({ orderId: order.id, paypalOrderId: "fake_order" })
    .expect(401);
});

it("returns a 400 when purchasing a cancelled order", async () => {
  const userId = new Types.ObjectId().toHexString();
  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId,
    eventEnd: new Date(new Date().getTime() + 60000),
    price: 10,
    status: OrderStatus.Cancelled,
    version: 0,
  });
  await order.save();

  return request(app)
    .post("/api/payments")
    .set("Cookie", signIn(userId))
    .send({ orderId: order.id, paypalOrderId: "fake_order" })
    .expect(400);
});

it("returns 201 with valid inputs", async () => {
  const userId = new Types.ObjectId().toHexString();
  const price = Math.floor(Math.random() * 100000);
  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId,
    eventEnd: new Date(new Date().getTime() + 60000),
    price,
    status: OrderStatus.Created,
    version: 0,
  });
  await order.save();

  const paypalOrderId = randomBytes(16).toString("hex");

  await request(app)
    .post("/api/payments")
    .set("Cookie", signIn(userId))
    .send({ orderId: order.id, paypalOrderId })
    .expect(201);

  const payment = await Payment.findOne({ orderId: order.id, paypalOrderId });
  expect(payment).not.toBeNull();
});
