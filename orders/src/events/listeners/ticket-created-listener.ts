import { Message } from "node-nats-streaming";

import { Listener, Subjects, TicketCreatedEvent } from "@tazaker/common";

import { Event } from "../../models/event";
import { Ticket } from "../../models/ticket";

import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, eventId, price } = data;

    const event = await Event.findById(eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    const ticket = Ticket.build({ id, event, price });
    await ticket.save();

    msg.ack();
  }
}
