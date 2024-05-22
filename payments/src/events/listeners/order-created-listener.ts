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
      ticket: {
        id: data.ticket.id,
        userId: data.ticket.userId,
        price: data.ticket.price,
      },
      eventEnd: new Date(data.ticket.event.end),
      status: data.status,
      version: data.version,
    });
    await order.save();

    msg.ack();
  }
}
