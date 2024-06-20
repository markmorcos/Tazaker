import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

import { EventCreatedEvent } from "@tazaker/common";

import { nats } from "../../../nats";
import { Event } from "../../../models/event";

import { EventCreatedListener } from "../event-created-listener";

const setup = async () => {
  const listener = new EventCreatedListener(nats.client);

  const data: EventCreatedEvent["data"] = {
    id: new Types.ObjectId().toHexString(),
    title: "Event",
    url: "http://example.com/event",
    image: "http://example.com/image.jpg",
    start: new Date().toISOString().split("T")[0],
    end: new Date(new Date().getTime() + 60000).toISOString().split("T")[0],
    timezone: "Europe/Berlin",
    version: 0,
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const event = await Event.findById(data.id);

  expect(event).toBeDefined();
  expect(event!.id).toEqual(data.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
