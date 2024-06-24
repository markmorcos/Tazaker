import request from "supertest";
import { Types } from "mongoose";

import { app } from "../../app";
import { createTicket, signIn } from "../../test/global";
import { nats } from "../../nats";
import { Ticket } from "../../models/ticket";

it("throws an error if the provided ID does not exist", async () => {
  const id = new Types.ObjectId().toHexString();
  const body = { price: 10 };

  await request(app)
    .put("/api/tickets/invalid")
    .set("Cookie", signIn())
    .send(body)
    .expect(400);
  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", signIn())
    .send(body)
    .expect(404);
});

it("returns a 401 if the user is not authenticated", () => {
  const id = new Types.ObjectId().toHexString();
  return request(app).put(`/api/tickets/${id}`).send({}).expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const ticket = await createTicket({
    eventId: new Types.ObjectId().toHexString(),
    price: 10,
  });
  return request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", signIn())
    .send({ price: 20 })
    .expect(401);
});

it("returns a 400 if the user provides an invalid price", async () => {
  const userId = new Types.ObjectId().toHexString();
  const ticket = await createTicket({ userId, price: 10 });
  return request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", signIn(userId))
    .send({ price: -10 })
    .expect(400);
});

it("rejects updates if the ticket is reserved", async () => {
  const userId = new Types.ObjectId().toHexString();
  const { id } = await createTicket({
    userId,
    eventId: new Types.ObjectId().toHexString(),
    price: 10,
  });

  const ticket = await Ticket.findById(id);
  ticket!.set("order", new Types.ObjectId().toHexString());
  await ticket!.save();

  return request(app)
    .put(`/api/tickets/${ticket!.id}`)
    .set("Cookie", signIn(userId))
    .send({ price: 20 })
    .expect(400);
});

it("update the ticket provided valid input", async () => {
  const userId = new Types.ObjectId().toHexString();
  const ticket = await createTicket({
    userId,
    eventId: new Types.ObjectId().toHexString(),
    price: 10,
  });
  await request(app)
    .put(`/api/tickets/${ticket.id}`)
    .set("Cookie", signIn(userId))
    .send({ price: 20 })
    .expect(200);

  const { body } = await request(app)
    .get(`/api/tickets/${ticket.id}`)
    .set("Cookie", signIn(userId))
    .expect(200);
  expect(body.price).toEqual(20);

  expect(nats.client.publish).toHaveBeenCalled();
});
