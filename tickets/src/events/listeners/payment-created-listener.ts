import { Message } from "node-nats-streaming";

import { Listener, PaymentCreatedEvent, Subjects } from "@tazaker/common";

import { Order } from "../../models/order";

import { queueGroupName } from "./queue-group-name";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated-publisher";
import { Ticket } from "../../models/ticket";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId);
    if (!order) {
      throw new Error("Order not found");
    }

    const ticket = await Ticket.findById(order.ticket);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    ticket.set({ order });
    await ticket.save();

    await new TicketUpdatedPublisher(this.client).publish({
      id: ticket.id,
      price: ticket.price,
      orderId: ticket.order!.id,
      version: ticket.version,
    });

    msg.ack();
  }
}
