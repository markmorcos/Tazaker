import { Publisher, Subjects, OrderExpiredEvent } from "@tazaker/common";

export class OrderExpiredPublisher extends Publisher<OrderExpiredEvent> {
  readonly subject = Subjects.OrderExpired;
}
