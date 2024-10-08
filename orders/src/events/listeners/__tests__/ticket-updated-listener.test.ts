import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

import { TicketUpdatedEvent } from "@tazaker/common";

import { nats } from "../../../nats";
import { User } from "../../../models/user";
import { Event } from "../../../models/event";
import { Ticket } from "../../../models/ticket";

import { TicketUpdatedListener } from "../ticket-updated-listener";

const setup = async () => {
  const listener = new TicketUpdatedListener(nats.client);

  const user = User.build({
    id: new Types.ObjectId().toHexString(),
    email: "test@example.com",
  });
  await user.save();

  const event = Event.build({
    id: new Types.ObjectId().toHexString(),
    title: "Event",
    start: new Date(),
    end: new Date(new Date().getTime() + 60000),
    timezone: "Europe/Berlin",
  });
  await event.save();

  const id = new Types.ObjectId().toHexString();
  const price = 10;
  const ticket = Ticket.build({ id, user, event, price });
  await ticket.save();

  const data: TicketUpdatedEvent["data"] = {
    id,
    price: 10,
    orderId: new Types.ObjectId().toHexString(),
    version: ticket.version + 1,
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, ticket, data, msg };
};

it("finds, updates and saves a ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(data.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.price).toEqual(ticket.price);
  expect(updatedTicket!.version).toEqual(data.version);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});

it("does not call ack if the event has a skipped version number", async () => {
  const { listener, ticket, data, msg } = await setup();

  data.version = 10;

  try {
    await listener.onMessage(data, msg);
  } catch (error) {}

  expect(msg.ack).not.toHaveBeenCalled();
});
