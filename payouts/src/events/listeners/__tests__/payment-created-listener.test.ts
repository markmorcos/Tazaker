import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

import { PaymentCreatedEvent } from "@tazaker/common";

import { nats } from "../../../nats";

import { PaymentCreatedListener } from "../payment-created-listener";
import { Wallet } from "../../../models/wallet";

const setup = async () => {
  const listener = new PaymentCreatedListener(nats.client);

  const data: PaymentCreatedEvent["data"] = {
    id: new Types.ObjectId().toHexString(),
    paypalOrderId: "paypal",
    order: {
      id: new Types.ObjectId().toHexString(),
      userId: new Types.ObjectId().toHexString(),
      ticket: {
        id: new Types.ObjectId().toHexString(),
        userId: new Types.ObjectId().toHexString(),
        price: 10,
      },
    },
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg };
};

it("saves the price successfully", async () => {
  const { listener, data, msg } = await setup();

  const balanceBefore = await Wallet.balance(data.order.ticket.userId);

  await listener.onMessage(data, msg);

  const balanceAfter = await Wallet.balance(data.order.ticket.userId);

  expect(balanceBefore).toEqual(balanceAfter - data.order.ticket.price);
  expect(msg.ack).toHaveBeenCalled();
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
