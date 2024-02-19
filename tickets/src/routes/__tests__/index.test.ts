import request from "supertest";
import { Types } from "mongoose";

import { app } from "../../app";
import { createTicket } from "../../test/global";

it("require an event ID for listing tickets", async () => {
  return request(app).get("/api/tickets").send().expect(400);
});

it("can fetch a list of tickets", async () => {
  const eventId = new Types.ObjectId().toHexString();
  await createTicket({ eventId, price: 10 });
  await createTicket({ eventId, price: 20 });
  await createTicket({ eventId, price: 30 });

  const response = await request(app)
    .get(`/api/tickets?eventId=${eventId}`)
    .send()
    .expect(200);
  expect(response.body).toHaveLength(3);
});
