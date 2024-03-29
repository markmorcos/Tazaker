import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

import { OrderExpiredEvent, OrderStatus } from "@tazaker/common";

import { nats } from "../../../nats";
import { Order } from "../../../models/order";

import { OrderExpiredListener } from "../order-expired-listener";

const setup = async () => {
  const listener = new OrderExpiredListener(nats.client);

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId: new Types.ObjectId().toHexString(),
    eventEnd: new Date(new Date().getTime() + 60000),
    price: 10,
    status: OrderStatus.Created,
    version: 0,
  });
  await order.save();

  const data: OrderExpiredEvent["data"] = {
    id: order.id,
    ticket: { id: new Types.ObjectId().toHexString() },
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
