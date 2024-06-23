import { Message } from "node-nats-streaming";

import { Listener, Subjects, UserCreatedEvent } from "@tazaker/common";

import { User } from "../../models/user";

import { queueGroupName } from "./queue-group-name";

export class UserCreatedListener extends Listener<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: UserCreatedEvent["data"], msg: Message) {
    const user = User.build({ id: data.id, email: data.email });
    await user.save();

    msg.ack();
  }
}
