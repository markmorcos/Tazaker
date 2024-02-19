import { Subjects } from "./subjects";

export interface TicketUpdatedEvent {
  subject: Subjects.TicketUpdated;
  data: {
    id: string;
    userId: string;
    eventId: string;
    price: number;
    orderId?: string;
    version: number;
  };
}
