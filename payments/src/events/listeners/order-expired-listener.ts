import { Message } from "node-nats-streaming";

import {
  Listener,
  OrderExpiredEvent,
  OrderStatus,
  Subjects,
} from "@tazaker/common";

import { Order } from "../../models/order";

import { queueGroupName } from "./queue-group-name";

export class OrderExpiredListener extends Listener<OrderExpiredEvent> {
  readonly subject = Subjects.OrderExpired;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderExpiredEvent["data"], msg: Message) {
    const order = await Order.findByEvent(data);
    if (!order) {
      return console.error("Order not found");
    }

    order.set("status", OrderStatus.Expired);
    await order.save();

    msg.ack();
  }
}
