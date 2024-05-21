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

  const walletBefore = await Wallet.findOne({
    userId: data.order.ticket.userId,
  });
  const balanceBefore = walletBefore?.balance || 0;

  await listener.onMessage(data, msg);

  const walletAfter = await Wallet.findOne({
    userId: data.order.ticket.userId,
  });
  const balanceAfter = walletAfter?.balance || data.order.ticket.price;

  expect(balanceBefore).toEqual(balanceAfter - data.order.ticket.price);
  expect(msg.ack).toHaveBeenCalled();
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
