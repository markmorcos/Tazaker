import { Message } from "node-nats-streaming";

import { Listener, OrderCreatedEvent, Subjects } from "@tazaker/common";

import { Ticket } from "../../models/ticket";

import { queueGroupName } from "./queue-group-name";
import { Order } from "../../models/order";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const ticket = await Ticket.findById(data.ticketId);
    if (!ticket) {
      throw new Error("Ticket not found");
    }

    const order = Order.build({
      id: data.id,
      userId: data.userId,
      ticket,
      version: data.version,
    });
    await order.save();

    msg.ack();
  }
}
