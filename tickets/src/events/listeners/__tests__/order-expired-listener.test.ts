import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

import { OrderExpiredEvent } from "@tazaker/common";

import { nats } from "../../../nats";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";

import { OrderExpiredListener } from "../order-expired-listener";

const setup = async () => {
  const listener = new OrderExpiredListener(nats.client);

  const ticket = Ticket.build({
    userId: new Types.ObjectId().toHexString(),
    eventId: new Types.ObjectId().toHexString(),
    fileId: new Types.ObjectId().toHexString(),
    price: 10,
  });
  await ticket.save();

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId: new Types.ObjectId().toHexString(),
    ticket,
    version: 0,
  });
  await order.save();

  ticket.set({ order });
  await ticket.save();

  const data: OrderExpiredEvent["data"] = {
    id: order.id,
    ticketId: ticket.id,
    version: 0,
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, order, ticket, data, msg };
};

it("updates the ticket, publishes an event and acks the message", async () => {
  const { listener, ticket, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.order).toBeUndefined();
  expect(nats.client.publish).toHaveBeenCalled();
  expect(msg.ack).toHaveBeenCalled();
});
