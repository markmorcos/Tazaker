import { Publisher, Subjects, ExpirationCompleteEvent } from "@tazaker/common";

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly subject = Subjects.ExpirationComplete;
}
