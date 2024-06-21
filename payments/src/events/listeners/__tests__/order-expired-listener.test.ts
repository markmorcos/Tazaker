import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

import { OrderExpiredEvent, OrderStatus } from "@tazaker/common";

import { nats } from "../../../nats";
import { Event } from "../../../models/event";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { User } from "../../../models/user";

import { OrderExpiredListener } from "../order-expired-listener";

const setup = async () => {
  const listener = new OrderExpiredListener(nats.client);

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

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId: new Types.ObjectId().toHexString(),
    ticket,
    status: OrderStatus.Created,
    version: 0,
  });
  await order.save();

  const data: OrderExpiredEvent["data"] = {
    id: order.id,
    ticketId: ticket.id,
    version: 1,
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, order, data, msg };
};

it("updates the status of the order", async () => {
  const { listener, order, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const updatedOrder = await Order.findById(order.id);
  expect(updatedOrder!.status).toEqual(OrderStatus.Expired);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
