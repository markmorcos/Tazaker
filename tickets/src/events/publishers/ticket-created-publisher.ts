import { Publisher, Subjects, TicketCreatedEvent } from "@tazaker/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly subject = Subjects.TicketCreated;
}
