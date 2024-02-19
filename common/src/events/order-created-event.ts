import { Subjects } from "./subjects";
import { OrderStatus } from "./types";

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    userId: string;
    ticket: {
      id: string;
      event: { id: string; end: string };
      price: number;
    };
    status: OrderStatus;
    expiresAt: string;
    version: number;
  };
}
