import { Message } from "node-nats-streaming";

import { Listener, Subjects, EventUpdatedEvent } from "@tazaker/common";

import { Event } from "../../models/event";

import { queueGroupName } from "./queue-group-name";

export class EventUpdatedListener extends Listener<EventUpdatedEvent> {
  readonly subject = Subjects.EventUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: EventUpdatedEvent["data"], msg: Message) {
    const event = await Event.findByEvent(data);
    if (!event) {
      throw new Error("Event not found");
    }

    const { id, title, start, end, timezone } = data;
    event.set({
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
