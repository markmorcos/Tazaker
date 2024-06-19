import { Subjects } from "./subjects";

export interface OrderExpiredEvent {
  subject: Subjects.OrderExpired;
  data: { id: string; ticketId: string; version: number };
}
