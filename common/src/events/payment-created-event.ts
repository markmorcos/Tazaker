import { Subjects } from "./subjects";

export interface PaymentCreatedEvent {
  subject: Subjects.PaymentCreated;
  data: {
    id: string;
    paypalOrderId: string;
    order: {
      id: string;
      userId: string;
      ticketId: string;
    };
  };
}
