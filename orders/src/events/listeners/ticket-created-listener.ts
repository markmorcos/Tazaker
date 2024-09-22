import { Message } from "node-nats-streaming";

import { Listener, Subjects, TicketCreatedEvent } from "@tazaker/common";

import { User } from "../../models/user";
import { Event } from "../../models/event";
import { Ticket } from "../../models/ticket";

import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const { id, userId, eventId, price } = data;

    const user = await User.findById(userId);
    if (!user) {
      return console.error("User not found");
    }

    const event = await Event.findById(eventId);
    if (!event) {
      return console.error("Event not found");
    }

    const ticket = Ticket.build({ id, user, event, price });
    await ticket.save();

    msg.ack();
  }
}
