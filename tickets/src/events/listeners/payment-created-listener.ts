import { Message } from "node-nats-streaming";

import { Listener, PaymentCreatedEvent, Subjects } from "@tazaker/common";

import { Ticket } from "../../models/ticket";

import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.order.ticket.id);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ orderUserId: data.order.userId });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      userId: ticket.userId,
      eventId: ticket.eventId,
      price: ticket.price,
      orderId: ticket.orderId,
      version: ticket.version,
    });

    msg.ack();
  }
}
