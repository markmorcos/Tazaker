import { Message } from "node-nats-streaming";

import { Listener, Subjects, EventCreatedEvent } from "@tazaker/common";

import { Event } from "../../models/event";

import { queueGroupName } from "./queue-group-name";

export class EventCreatedListener extends Listener<EventCreatedEvent> {
  readonly subject = Subjects.EventCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: EventCreatedEvent["data"], msg: Message) {
    const { id, title, start, end, timezone } = data;

    const event = Event.build({
      id,
      title,
      start: new Date(start),
      end: new Date(end),
      timezone,
    });
    await event.save();

    msg.ack();
  }
}
