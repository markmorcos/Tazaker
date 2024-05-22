import { Message } from "node-nats-streaming";

import { Listener, PaymentCreatedEvent, Subjects } from "@tazaker/common";

import { Wallet } from "../../models/wallet";

import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const { userId, price: amount } = data.order.ticket;

    const payment = Wallet.build({ userId, amount });
    await payment.save();

    msg.ack();
  }
}
