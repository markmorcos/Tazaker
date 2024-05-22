import { Types } from "mongoose";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { app } from "../app";
import { OrderPayload } from "../models/order";
import { Ticket } from "../models/ticket";
import { Event } from "../models/event";

export const signIn = (id = new Types.ObjectId().toHexString()) => {
  const payload = { id, email: "test@example.com" };
  const jwt = sign(payload, process.env.JWT_KEY!);
  const session = JSON.stringify({ jwt });
  const base64 = Buffer.from(session).toString("base64");
  return [`session=${base64}`];
};

export const createTicket = async () => {
  const id = new Types.ObjectId().toHexString();

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

  return ticket;
};

export const createOrder = async (
  ticketId: string,
  userId?: string
): Promise<OrderPayload> => {
  const { body } = await request(app)
    .post("/api/orders")
    .set("Cookie", signIn(userId))
    .send({ ticketId });
  return body;
};
