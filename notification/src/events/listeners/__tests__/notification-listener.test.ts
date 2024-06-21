import { Message } from "node-nats-streaming";
import sgMail from "@sendgrid/mail";

import { NotificationType } from "@tazaker/common";

import { nats } from "../../../nats";

import {
  NotificationListener,
  sendgridTemplates,
} from "../notification-listener";

const setup = async () => {
  const listener = new NotificationListener(nats.client);

  const auth = {
    type: NotificationType.Auth,
    email: "test@example.com",
    payload: { url: "http://example.com" },
  };

  const sale = {
    type: NotificationType.Sale,
    email: "test@example.com",
    payload: {
      eventTitle: "Event",
      eventUrl: "http://example.com/event",
      price: 10,
    },
  };

  const payout = {
    type: NotificationType.Auth,
    email: "test@example.com",
    payload: { amount: 20 },
  };

  // @ts-ignore
  const msg: Message = { ack: jest.fn() };

  return { listener, auth, sale, payout, msg };
};

it("sends the correct email with payload on auth", async () => {
  const { listener, auth, msg } = await setup();

  await listener.onMessage(auth, msg);

  expect(sgMail.send).toHaveBeenCalledWith({
    from: "Tazaker <info@tazaker.org>",
    personalizations: [
      {
        dynamicTemplateData: { url: "http://example.com" },
        to: "test@example.com",
      },
    ],
    templateId: sendgridTemplates[NotificationType.Auth],
  });
});

it("sends the correct email with sale on auth", async () => {
  const { listener, sale, msg } = await setup();

  await listener.onMessage(sale, msg);

  expect(sgMail.send).toHaveBeenCalledWith({
    from: "Tazaker <info@tazaker.org>",
    personalizations: [
      {
        dynamicTemplateData: {
          eventTitle: "Event",
          eventUrl: "http://example.com/event",
          price: 10,
        },
        to: "test@example.com",
      },
    ],
    templateId: sendgridTemplates[NotificationType.Sale],
  });
});

it("sends the correct email with payload on payout", async () => {
  const { listener, payout, msg } = await setup();

  await listener.onMessage(payout, msg);

  expect(sgMail.send).toHaveBeenCalledWith({
    from: "Tazaker <info@tazaker.org>",
    personalizations: [
      { dynamicTemplateData: { amount: 20 }, to: "test@example.com" },
    ],
    templateId: sendgridTemplates[NotificationType.Auth],
  });
});

it("acks the message", async () => {
  const { listener, auth, payout, sale, msg } = await setup();

  await listener.onMessage(auth, msg);
  await listener.onMessage(payout, msg);
  await listener.onMessage(sale, msg);

  expect(msg.ack).toHaveBeenCalledTimes(3);
});
