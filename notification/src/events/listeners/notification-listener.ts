import { Message } from "node-nats-streaming";

import {
  Listener,
  NotificationEvent,
  NotificationType,
  Subjects,
} from "@tazaker/common";

import * as mailer from "../../mailer";

import { queueGroupName } from "./queue-group-name";

export const sendgridTemplates = {
  [NotificationType.Auth]: "d-9e1523620a424dd7825a77ded3e1b39a",
  [NotificationType.Sale]: "d-93140dcf33c644b79fac21b8985de0c4",
};

export class NotificationListener extends Listener<NotificationEvent> {
  readonly subject = Subjects.Notification;
  queueGroupName = queueGroupName;

  async onMessage(data: NotificationEvent["data"], msg: Message) {
    const { type, email, payload } = data;
    const templateId = sendgridTemplates[type];

    if (!templateId || !email) {
      throw new Error("Invalid template or email address");
    }

    await mailer.send(templateId, email, payload);

    msg.ack();
  }
}
