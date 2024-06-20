import { Publisher, Subjects, UserUpdatedEvent } from "@tazaker/common";

export class UserUpdatedPublisher extends Publisher<UserUpdatedEvent> {
  readonly subject = Subjects.UserUpdated;
}
