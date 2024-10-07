import { Subjects } from "./subjects";
import { NotificationType } from "./types/notification-type";

export interface NotificationEvent {
  subject: Subjects.Notification;
  data: {
    type: NotificationType;
    email: string;
    payload: any;
  };
}
