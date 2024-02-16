import { Subjects } from "./subjects";

export interface ExpirationCompleteEvent {
  subject: Subjects.ExpirationComplete;
  data: { eventId?: string; orderId?: string };
}
