import { Message } from "node-nats-streaming";

import { Listener, TicketCreatedEvent, Subjects } from "@tazaker/common";

import { User } from "../../models/user";
import { Event } from "../../models/event";
import { Ticket } from "../../models/ticket";

import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const user = await User.findById(data.userId);
    if (!user) {
      throw new Error("User not found");
    }

    const event = await Event.findById(data.eventId);
    if (!event) {
      throw new Error("Event not found");
    }

    const ticket = Ticket.build({
      id: data.id,
      user,
      event,
      price: data.price,
    });
    await ticket.save();

    msg.ack();
  }
}
