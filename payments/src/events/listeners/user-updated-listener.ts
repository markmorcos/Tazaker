import { Message } from "node-nats-streaming";

import { Listener, Subjects, UserUpdatedEvent } from "@tazaker/common";

import { User } from "../../models/user";

import { queueGroupName } from "./queue-group-name";

export class UserUpdatedListener extends Listener<UserUpdatedEvent> {
  readonly subject = Subjects.UserUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserUpdatedEvent["data"], msg: Message) {
    const user = await User.findById(data.id);
    if (!user) {
      return console.error("User not found");
    }

    user.set("stripeAccountId", data.stripeAccountId);
    await user.save();

    msg.ack();
  }
}
