import request from "supertest";

import { app } from "../../app";
import { createEvent } from "../../test/global";
import { Types } from "mongoose";

it("returns a 404 if the event is not found", async () => {
  const id = new Types.ObjectId().toHexString();

  await request(app).get("/api/events/invalid").send().expect(400);
  await request(app).get(`/api/events/${id}`).send().expect(404);
});

it("returns a event if the event is found", async () => {
  const body = {
    title: "Event",
    url: "https://google.com",
    image: "https://placehold.it/180x60",
    start: new Date(),
    end: new Date(),
    timezone: "Europe/Berlin",
  };

  const event = await createEvent(body);
  const getResponse = await request(app)
    .get(`/api/events/${event.id}`)
    .send()
    .expect(200);
  expect(getResponse.body.title).toEqual(body.title);
});
