import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

import { OrderCreatedEvent, OrderStatus } from "@tazaker/common";

import { nats } from "../../../nats";
import { Event } from "../../../models/event";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { User } from "../../../models/user";

import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  const listener = new OrderCreatedListener(nats.client);

  const user = User.build({
    id: new Types.ObjectId().toHexString(),
    email: "test@example.com",
  });
  await user.save();

  const event = Event.build({
    id: new Types.ObjectId().toHexString(),
    title: "Event",
    url: "http://example.com/event",
    end: new Date(new Date().getTime() + 60000),
  });
  await event.save();

  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    user,
    event,
    price: 10,
  });
  await ticket.save();

  const data: OrderCreatedEvent["data"] = {
    id: new Types.ObjectId().toHexString(),
    userId: new Types.ObjectId().toHexString(),
    ticketId: ticket.id,
    status: OrderStatus.Created,
    expiresAt: new Date().toISOString(),
    version: 0,
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, ticket, data, msg };
};

it("replicates the order info", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const order = await Order.findById(data.id).populate("ticket");
  expect(order!.ticket.price).toEqual(ticket.price);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
