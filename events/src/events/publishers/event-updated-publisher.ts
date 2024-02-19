import { Publisher, Subjects, EventUpdatedEvent } from "@tazaker/common";

export class EventUpdatedPublisher extends Publisher<EventUpdatedEvent> {
  readonly subject = Subjects.EventUpdated;
}
