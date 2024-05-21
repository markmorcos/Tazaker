import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

import { PaymentCreatedEvent } from "@tazaker/common";

import { nats } from "../../../nats";

import { PaymentCreatedListener } from "../payment-created-listener";

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

it("sends the payout successfully", async () => {});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
