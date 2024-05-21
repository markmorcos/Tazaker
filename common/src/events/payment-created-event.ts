import { Subjects } from "./subjects";

export interface PaymentCreatedEvent {
  subject: Subjects.PaymentCreated;
  data: {
    id: string;
    paypalOrderId: string;
    order: {
      id: string;
      userId: string;
      ticket: { id: string; userId: string; price: number };
    };
  };
}
