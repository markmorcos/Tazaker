import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

import { TicketCreatedEvent } from "@tazaker/common";

import { nats } from "../../../nats";
import { Event } from "../../../models/event";
import { Ticket } from "../../../models/ticket";

import { TicketCreatedListener } from "../ticket-created-listener";

const setup = async () => {
  const listener = new TicketCreatedListener(nats.client);

  const event = Event.build({
    id: new Types.ObjectId().toHexString(),
    title: "Event",
    start: new Date(),
    end: new Date(new Date().getTime() + 60000),
    timezone: "Europe/Berlin",
  });
  await event.save();

  const data: TicketCreatedEvent["data"] = {
    id: new Types.ObjectId().toHexString(),
    userId: new Types.ObjectId().toHexString(),
    eventId: event.id,
    price: 10,
    version: 0,
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.price).toEqual(data.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
