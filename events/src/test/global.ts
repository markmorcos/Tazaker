import { Types } from "mongoose";
import { sign } from "jsonwebtoken";
import request from "supertest";

import { app } from "../app";
import { EventAttrs, EventPayload } from "../models/event";

export const signIn = (id = new Types.ObjectId().toHexString()) => {
  const payload = { id, email: "mark.yehia@gmail.com" };
  const jwt = sign(payload, process.env.JWT_KEY!);
  const session = JSON.stringify({ jwt });
  const base64 = Buffer.from(session).toString("base64");
  return [`session=${base64}`];
};

export const createEvent = async (
  attrs: Partial<EventAttrs>
): Promise<EventPayload> => {
  const body = {
    title: attrs.title,
    url: attrs.url,
    image: attrs.image,
    start: attrs.start!.toISOString(),
    end: attrs.end!.toISOString(),
    timezone: "Europe/Berlin",
  };

  const response = await request(app)
    .post("/api/events")
    .set("Cookie", signIn())
    .send(body)
    .expect(201);

  return response.body;
};
