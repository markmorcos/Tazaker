import { Publisher, Subjects, TicketUpdatedEvent } from "@tazaker/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject = Subjects.TicketUpdated;
}
