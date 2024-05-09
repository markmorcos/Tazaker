import { Message } from "node-nats-streaming";

import { Listener, OrderCreatedEvent, Subjects } from "@tazaker/common";

import { Order } from "../../models/order";

import { queueGroupName } from "./queue-group-name";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent["data"], msg: Message) {
    const order = Order.build({
      id: data.id,
      userId: data.userId,
      ticketId: data.ticket.id,
      eventEnd: new Date(data.ticket.event.end),
      price: data.ticket.price,
      status: data.status,
      version: data.version,
    });
    await order.save();

    msg.ack();
  }
}
