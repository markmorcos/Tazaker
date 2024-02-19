import request from "supertest";

import { app } from "../../app";
import { createEvent, signIn } from "../../test/global";
import { Event } from "../../models/event";
import { nats } from "../../nats";

it("has a route handler listening to POST /api/events", async () => {
  const { status } = await request(app).post("/api/events").send({});
  expect(status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", () => {
  return request(app).post("/api/events").send({}).expect(401);
});

it("returns a status other than 401 if the user is signed in", async () => {
  const { status } = await request(app)
    .post("/api/events")
    .set("Cookie", signIn())
    .send({});
  expect(status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/events")
    .set("Cookie", signIn())
    .send({
      title: "",
      url: "https://google.com",
      image: "https://placehold.it/180x60",
      start: new Date(),
      end: new Date(),
      timezone: "Europe/Berlin",
    })
    .expect(400);
  await request(app)
    .post("/api/events")
    .set("Cookie", signIn())
    .send({
      url: "https://google.com",
      image: "https://placehold.it/180x60",
      start: new Date(),
      end: new Date(),
      timezone: "Europe/Berlin",
    })
    .expect(400);
});

it("creates a event with valid input", async () => {
  const oldEvents = await Event.find({});
  expect(oldEvents).toHaveLength(0);

  await createEvent({
    title: "Event",
    url: "https://google.com",
    image: "https://placehold.it/180x60",
    start: new Date(),
    end: new Date(),
    timezone: "Europe/Berlin",
  });

  const newEvents = await Event.find({});
  expect(newEvents).toHaveLength(1);

  expect(nats.client.publish).toHaveBeenCalled();
});
