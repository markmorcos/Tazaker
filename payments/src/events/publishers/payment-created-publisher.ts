import { Publisher, Subjects, PaymentCreatedEvent } from "@tazaker/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly subject = Subjects.PaymentCreated;
}
