import { Message } from "node-nats-streaming";

import { Listener, PaymentCreatedEvent, Subjects } from "@tazaker/common";

import { Wallet } from "../../models/wallet";

import { queueGroupName } from "./queue-group-name";

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent["data"], msg: Message) {
    const {
      order: {
        ticket: { userId, price },
      },
    } = data;

    let wallet;

    wallet = await Wallet.findOne({ userId });
    if (!wallet) {
      wallet = Wallet.build({ userId, balance: 0 });
    }

    wallet.set("balance", wallet.balance + price);
    await wallet.save();

    msg.ack();
  }
}
