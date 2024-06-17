import { Message } from "node-nats-streaming";

import {
  Listener,
  NotificationEvent,
  NotificationType,
  Subjects,
} from "@tazaker/common";

import * as mailer from "../../mailer";

import { queueGroupName } from "./queue-group-name";

const template = {
  [NotificationType.Auth]: "d-9e1523620a424dd7825a77ded3e1b39a",
  [NotificationType.Sale]: "d-93140dcf33c644b79fac21b8985de0c4",
  [NotificationType.Payout]: "d-6dcd39cd324e4e3dafbefe489bd87241",
};

export class NotificationListener extends Listener<NotificationEvent> {
  readonly subject = Subjects.Notification;
  queueGroupName = queueGroupName;

  async onMessage(data: NotificationEvent["data"], msg: Message) {
    const { type, email, payload } = data;

    if (!template[type] || !email) {
      throw new Error("Invalid template or email address");
    }

    const templateId = template[type];
    await mailer.send(templateId, email, payload);

    msg.ack();
  }
}
