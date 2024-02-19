import { Publisher, Subjects, EventCreatedEvent } from "@tazaker/common";

export class EventCreatedPublisher extends Publisher<EventCreatedEvent> {
  readonly subject = Subjects.EventCreated;
}
