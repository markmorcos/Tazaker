import { Types } from "mongoose";
import { Message } from "node-nats-streaming";

import { UserCreatedEvent } from "@tazaker/common";

import { nats } from "../../../nats";
import { User } from "../../../models/user";

import { UserCreatedListener } from "../user-created-listener";

const setup = async () => {
  const listener = new UserCreatedListener(nats.client);

  const data: UserCreatedEvent["data"] = {
    id: new Types.ObjectId().toHexString(),
    email: "test@example.com",
    version: 0,
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, data, msg };
};

it("creates and saves a ticket", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  const event = await User.findById(data.id);

  expect(event).toBeDefined();
  expect(event!.email).toEqual(data.email);
});

it("acks the message", async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessage(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
