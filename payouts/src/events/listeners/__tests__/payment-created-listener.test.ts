import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

import { PaymentCreatedEvent } from "@tazaker/common";

import { nats } from "../../../nats";
import { Order } from "../../../models/order";
import { Ticket } from "../../../models/ticket";
import { Wallet } from "../../../models/wallet";

import { PaymentCreatedListener } from "../payment-created-listener";

const setup = async () => {
  const listener = new PaymentCreatedListener(nats.client);

  const userId = new Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    id: new Types.ObjectId().toHexString(),
    userId,
    price: 10,
  });
  await ticket.save();

  const order = Order.build({
    id: new Types.ObjectId().toHexString(),
    userId,
    ticket,
    version: 0,
  });
  await order.save();

  const data: PaymentCreatedEvent["data"] = {
    id: new Types.ObjectId().toHexString(),
    orderId: order.id,
    paypalOrderId: "paypal",
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, ticket, data, msg };
};

it("saves the price successfully", async () => {
  const { listener, ticket, data, msg } = await setup();

  const balanceBefore = await Wallet.balance(ticket.userId);

  await listener.onMessage(data, msg);

  const balanceAfter = await Wallet.balance(ticket.userId);

  expect(balanceBefore).toEqual(balanceAfter - ticket.price);
  expect(msg.ack).toHaveBeenCalled();
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
