import { Types } from "mongoose";
import request from "supertest";
import { randomBytes } from "crypto";

import { OrderStatus } from "@tazaker/common";

import { app } from "../../app";
import { signIn } from "../../test/global";
import { Event } from "../../models/event";
import { Order } from "../../models/order";
import { Payment } from "../../models/payment";
import { Ticket } from "../../models/ticket";
import { User } from "../../models/user";

it("returns a 404 when purchasing an order that does not exist", async () => {
  return request(app)
    .post("/api/payments")
    .set("Cookie", signIn())
    .send({
      orderId: new Types.ObjectId().toHexString(),
    })
    .expect(404);
});

it("returns a 401 when purchasing an order that does not belong to the user", async () => {
  const user = User.build({
    id: new Types.ObjectId().toHexString(),
    email: "test@example.com",
  });
  await user.save();

  const event = Event.build({
    id: new Types.ObjectId().toHexString(),
    title: "Event",
    url: "http://example.com/event",
    end: new Date(new Date().getTime() + 60000),
  });
  await event.save();

  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    user,
    event,
    price: 10,
  });
  await ticket.save();

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId: new Types.ObjectId().toHexString(),
    ticket,
    status: OrderStatus.Created,
    version: 0,
  });
  await order.save();

  return request(app)
    .post("/api/payments")
    .set("Cookie", signIn())
    .send({ orderId: order.id })
    .expect(401);
});

it("returns a 400 when purchasing an expired order", async () => {
  const user = User.build({
    id: new Types.ObjectId().toHexString(),
    email: "test@example.com",
  });
  await user.save();

  const event = Event.build({
    id: new Types.ObjectId().toHexString(),
    title: "Event",
    url: "http://example.com/event",
    end: new Date(new Date().getTime() + 60000),
  });
  await event.save();

  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    user,
    event,
    price: 10,
  });
  await ticket.save();

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId: user.id,
    ticket,
    status: OrderStatus.Expired,
    version: 0,
  });
  await order.save();

  return request(app)
    .post("/api/payments")
    .set("Cookie", signIn(user.id))
    .send({ orderId: order.id })
    .expect(400);
});

it("returns 201 with valid inputs", async () => {
  const user = User.build({
    id: new Types.ObjectId().toHexString(),
    email: "test@example.com",
  });
  await user.save();

  const event = Event.build({
    id: new Types.ObjectId().toHexString(),
    title: "Event",
    url: "http://example.com/event",
    end: new Date(new Date().getTime() + 60000),
  });
  await event.save();

  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    user,
    event,
    price: 10,
  });
  await ticket.save();

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId: user.id,
    ticket,
    status: OrderStatus.Created,
    version: 0,
  });
  await order.save();

  await request(app)
    .post("/api/payments")
    .set("Cookie", signIn(user.id))
    .send({ orderId: order.id })
    .expect(201);

  const payment = await Payment.findOne({ orderId: order.id });
  expect(payment).not.toBeNull();
});
