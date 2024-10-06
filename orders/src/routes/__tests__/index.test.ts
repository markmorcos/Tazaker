import request from "supertest";

import { app } from "../../app";
import { createOrder, createTicket, signIn } from "../../test/global";
import { Order } from "../../models/order";
import { OrderStatus } from "@tazaker/common";
import { Types } from "mongoose";

it("fetches orders for a particular user", async () => {
  const firstTicket = await createTicket();
  const secondTicket = await createTicket();
  const thirdTicket = await createTicket();

  const firstUser = signIn();
  const secondUser = signIn();

  await request(app)
    .post("/api/orders")
    .set("Cookie", firstUser)
    .send({ ticketId: firstTicket.id })
    .expect(201);
  const { body: firstOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", secondUser)
    .send({ ticketId: secondTicket.id })
    .expect(201);
  const { body: secondOrder } = await request(app)
    .post("/api/orders")
    .set("Cookie", secondUser)
    .send({ ticketId: thirdTicket.id })
    .expect(201);

  const { body } = await request(app)
    .get("/api/orders")
    .set("Cookie", secondUser)
    .expect(200);

  expect(body).toHaveLength(2);

  expect(body[0].id).toEqual(secondOrder.id);
  expect(body[0].ticket.id).toEqual(thirdTicket.id);

  expect(body[1].id).toEqual(firstOrder.id);
  expect(body[1].ticket.id).toEqual(secondTicket.id);
});

it("fetches sales for a particular user", async () => {
  const firstUserId = new Types.ObjectId().toHexString();
  const secondUserId = new Types.ObjectId().toHexString();

  const firstTicket = await createTicket(firstUserId);
  const secondTicket = await createTicket(secondUserId);
  const thirdTicket = await createTicket(secondUserId);

  const thirdUserId = new Types.ObjectId().toHexString();
  const fourthUserId = new Types.ObjectId().toHexString();
  await createOrder(firstTicket.id, thirdUserId);
  const { id: orderId } = await createOrder(secondTicket.id, fourthUserId);
  await createOrder(thirdTicket.id, fourthUserId);

  const secondOrder = await Order.findById(orderId);
  expect(secondOrder).toBeDefined();

  secondOrder!.set("status", OrderStatus.Complete);
  await secondOrder!.save();

  const { body } = await request(app)
    .get("/api/orders/sales")
    .set("Cookie", signIn(secondUserId))
    .expect(200);

  expect(body).toHaveLength(1);
  expect(body[0].ticket.id).toEqual(secondTicket.id);
});
