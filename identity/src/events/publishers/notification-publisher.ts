import { Publisher, Subjects, NotificationEvent } from "@tazaker/common";

export class NotificationPublisher extends Publisher<NotificationEvent> {
  readonly subject = Subjects.Notification;
}
