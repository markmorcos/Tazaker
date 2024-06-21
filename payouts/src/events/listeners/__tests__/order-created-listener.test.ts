import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

import { OrderCreatedEvent, OrderStatus } from "@tazaker/common";

import { nats } from "../../../nats";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";

import { OrderCreatedListener } from "../order-created-listener";

const setup = async () => {
  const listener = new OrderCreatedListener(nats.client);

  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    userId: new Types.ObjectId().toHexString(),
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

it("sets the orderId of the ticket", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const createdOrder = await Order.findById(data.id).populate("ticket");

  expect(createdOrder!.ticket.id).toEqual(ticket.id);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
