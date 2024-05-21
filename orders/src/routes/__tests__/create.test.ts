import { Types } from "mongoose";
import request from "supertest";

import { OrderStatus } from "@tazaker/common";

import { app } from "../../app";
import { signIn } from "../../test/global";
import { Event } from "../../models/event";
import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";
import { nats } from "../../nats";

it("returns an error if the ticket does not exist", () => {
  return request(app)
    .post("/api/orders")
    .set("Cookie", signIn())
    .send({ ticketId: new Types.ObjectId() })
    .expect(404);
});

it("returns an error if the ticket is already reserved", async () => {
  const id = new Types.ObjectId().toHexString();
  const userId = new Types.ObjectId().toHexString();
  const event = Event.build({
    id: new Types.ObjectId().toHexString(),
    title: "Event",
    start: new Date(),
    end: new Date(new Date().getTime() + 60000),
    timezone: "Europe/Berlin",
  });
  await event.save();

  const ticket = Ticket.build({
    id,
    userId: new Types.ObjectId().toHexString(),
    event,
    price: 10,
  });
  await ticket.save();

  const order = Order.build({
    userId,
    ticket,
    status: OrderStatus.Created,
    expiresAt: new Date(),
  });
  await order.save();

  await request(app)
    .post("/api/orders")
    .set("Cookie", signIn(userId))
    .send({ ticketId: ticket.id })
    .expect(200);

  order.set({ userId: new Types.ObjectId().toHexString() });
  await order.save();

  return request(app)
    .post("/api/orders")
    .set("Cookie", signIn(userId))
    .send({ ticketId: ticket.id })
    .expect(400);
});

it("reserves a ticket", async () => {
  const id = new Types.ObjectId().toHexString();
  const userId = new Types.ObjectId().toHexString();

  const event = Event.build({
    id: new Types.ObjectId().toHexString(),
    title: "Event",
    start: new Date(),
    end: new Date(new Date().getTime() + 60000),
    timezone: "Europe/Berlin",
  });
  await event.save();

  const ticket = Ticket.build({
    id,
    userId: new Types.ObjectId().toHexString(),
    event,
    price: 10,
  });
  await ticket.save();

  const { body } = await request(app)
    .post("/api/orders")
    .set("Cookie", signIn(userId))
    .send({ ticketId: ticket.id })
    .expect(201);

  const order = await Order.findById(body.id);
  expect(order).toBeDefined();

  expect(nats.client.publish).toHaveBeenCalled();
});
