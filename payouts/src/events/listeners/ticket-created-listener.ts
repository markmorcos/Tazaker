import { Message } from "node-nats-streaming";

import { Listener, TicketCreatedEvent, Subjects } from "@tazaker/common";

import { Ticket } from "../../models/ticket";

import { queueGroupName } from "./queue-group-name";

export class TicketCreatedListener extends Listener<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketCreatedEvent["data"], msg: Message) {
    const ticket = Ticket.build({
      id: data.id,
      userId: data.userId,
      price: data.price,
    });
    await ticket.save();

    msg.ack();
  }
}
