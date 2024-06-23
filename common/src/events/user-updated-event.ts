import { Subjects } from "./subjects";

export interface UserUpdatedEvent {
  subject: Subjects.UserUpdated;
  data: { id: string; stripeAccountId?: string; version: number };
}
