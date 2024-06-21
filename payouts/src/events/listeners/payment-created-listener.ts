import { Message } from "node-nats-streaming";

import { Listener, PaymentCreatedEvent, Subjects } from "@tazaker/common";

import { Order } from "../../models/order";
import { Wallet } from "../../models/wallet";

import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const order = await Order.findById(data.orderId).populate("ticket");
    if (!order) {
      throw new Error("Order not found");
    }

    const { userId, price: amount } = order.ticket;
    const payment = Wallet.build({ userId, amount });
    await payment.save();

    msg.ack();
  }
}
