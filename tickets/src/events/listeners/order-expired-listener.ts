import { Message } from "node-nats-streaming";

import { Listener, OrderExpiredEvent, Subjects } from "@tazaker/common";

import { Ticket } from "../../models/ticket";

import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";

export class OrderExpiredListener extends Listener<OrderExpiredEvent> {
  readonly subject = Subjects.OrderExpired;
  queueGroupName = queueGroupName;
  async onMessage(data: OrderExpiredEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticketId);
    if (!ticket) {
      return console.error("Ticket not found");
    }

    ticket.set("order", undefined);
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      orderId: undefined,
      version: ticket.version,
    });

    msg.ack();
  }
}
