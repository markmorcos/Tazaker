import request from "supertest";
import { Types } from "mongoose";

import { app } from "../../app";
import { createEvent, signIn } from "../../test/global";
import { nats } from "../../nats";

it("throws an error if the provided ID does not exist", async () => {
  const id = new Types.ObjectId().toHexString();
  const body = {
    title: "Event",
    url: "https://google.com",
    image: "https://placehold.it/180x60",
    start: "1970-01-01T00:00:00",
    end: "1970-01-01T00:00:00",
    timezone: "Europe/Berlin",
  };

  await request(app)
    .put("/api/events/invalid")
    .set("Cookie", signIn())
    .send(body)
    .expect(400);
  await request(app)
    .put(`/api/events/${id}`)
    .set("Cookie", signIn())
    .send(body)
    .expect(404);
});

it("returns a 401 if the user is not authenticated", () => {
  const id = new Types.ObjectId().toHexString();
  return request(app).put(`/api/events/${id}`).send({}).expect(401);
});

it("returns a 400 if the user provides an invalid input", async () => {
  const event = await createEvent({
    title: "Event",
    url: "https://google.com",
    image: "https://placehold.it/180x60",
    start: new Date(),
    end: new Date(),
    timezone: "Europe/Berlin",
  });
  await request(app)
    .put(`/api/events/${event.id}`)
    .set("Cookie", signIn())
    .send({ title: "" })
    .expect(400);
});

it("update the event provided valid input", async () => {
  const event = await createEvent({
    title: "Event",
    url: "https://google.com",
    image: "https://placehold.it/180x60",
    start: new Date(),
    end: new Date(),
    timezone: "Europe/Berlin",
  });
  await request(app)
    .put(`/api/events/${event.id}`)
    .set("Cookie", signIn())
    .send({
      title: "New Event",
      url: "https://google.com",
      image: "https://placehold.it/180x60",
      start: "1970-01-01T00:00:00",
      end: "1970-01-01T00:00:00",
      timezone: "Europe/Berlin",
    })
    .expect(200);

  const { body } = await request(app)
    .get(`/api/events/${event.id}`)
    .set("Cookie", signIn())
    .expect(200);
  expect(body.title).toEqual("New Event");

  expect(nats.client.publish).toHaveBeenCalled();
});
