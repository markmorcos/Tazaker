import request from "supertest";

import { app } from "../../app";
import { createEvent } from "../../test/global";

it("can fetch a list of tickets", async () => {
  await createEvent({
    title: "Event 1",
    url: "https://google.com",
    image: "https://placehold.it/180x60",
    start: new Date(),
    end: new Date(),
    timezone: "Europe/Berlin",
  });
  await createEvent({
    title: "Event 2",
    url: "https://google.com",
    image: "https://placehold.it/180x60",
    start: new Date(),
    end: new Date(),
    timezone: "Europe/Berlin",
  });
  await createEvent({
    title: "Event 3",
    url: "https://google.com",
    image: "https://placehold.it/180x60",
    start: new Date(),
    end: new Date(),
    timezone: "Europe/Berlin",
  });

  const response = await request(app).get("/api/events").send().expect(200);
  expect(response.body).toHaveLength(3);
});
