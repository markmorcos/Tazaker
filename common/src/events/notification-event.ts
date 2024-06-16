import { Subjects } from "./subjects";
import { NotificationType } from "./types/notification-type";

export const baseURL = {
  development: "http://tazaker.dev",
  production: "https://www.tazaker.org",
}[process.env.ENVIRONMENT!];

export interface NotificationEvent {
  subject: Subjects.Notification;
  data: {
    type: NotificationType;
    email: string;
    payload: any;
  };
}
