import { Subjects } from "./subjects";

export interface OrderExpiredEvent {
  subject: Subjects.OrderExpired;
  data: { id: string; ticket: { id: string }; version: number };
}
