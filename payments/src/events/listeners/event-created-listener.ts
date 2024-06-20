import { Message } from "node-nats-streaming";

import { Listener, EventCreatedEvent, Subjects } from "@tazaker/common";

import { Event } from "../../models/event";

import { queueGroupName } from "./queue-group-name";

export class EventCreatedListener extends Listener<EventCreatedEvent> {
  readonly subject = Subjects.EventCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: EventCreatedEvent["data"], msg: Message) {
    const { id, title, url, end } = data;
    const event = Event.build({ id, title, url, end: new Date(end) });
    await event.save();

    msg.ack();
  }
}
