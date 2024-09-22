import { Message } from "node-nats-streaming";

import { Listener, OrderCreatedEvent, Subjects } from "@tazaker/common";

import { Ticket } from "../../models/ticket";
import { Order } from "../../models/order";

import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticketId);
    if (!ticket) {
      return console.error("Ticket not found");
    }

    const order = Order.build({
      id: data.id,
      userId: data.userId,
      ticket,
      status: data.status,
      version: data.version,
    });
    await order.save();

    msg.ack();
  }
}
