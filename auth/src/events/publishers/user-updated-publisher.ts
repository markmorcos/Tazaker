import { Publisher, Subjects, UserCreatedEvent } from "@tazaker/common";

export class UserCreatedPublisher extends Publisher<UserCreatedEvent> {
  readonly subject = Subjects.UserCreated;
}
