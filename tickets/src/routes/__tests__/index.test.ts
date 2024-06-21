import request from "supertest";
import { Types } from "mongoose";

import { app } from "../../app";
import { createTicket } from "../../test/global";
import { Order } from "../../models/order";
import { Ticket } from "../../models/ticket";

it("require an event ID for listing tickets", async () => {
  return request(app).get("/api/tickets").send().expect(400);
});

it("can fetch a list of tickets", async () => {
  const eventId = new Types.ObjectId().toHexString();
  await createTicket({ eventId, price: 10 });
  await createTicket({ eventId, price: 20 });
  await createTicket({ eventId, price: 30 });

  const orderedTicket = Ticket.build({
    userId: new Types.ObjectId().toHexString(),
    eventId: new Types.ObjectId().toHexString(),
    price: 10,
    fileId: new Types.ObjectId().toHexString(),
  });
  await orderedTicket.save();

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId: new Types.ObjectId().toHexString(),
    ticket: orderedTicket,
    version: 0,
  });
  await order.save();

  orderedTicket.set({ order });
  await orderedTicket.save();

  const response = await request(app)
    .get(`/api/tickets?eventId=${eventId}`)
    .send()
    .expect(200);
  expect(response.body).toHaveLength(3);
});
