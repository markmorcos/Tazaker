import { Subjects } from "./subjects";
import { OrderStatus } from "./types";

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    userId: string;
    ticketId: string;
    status: OrderStatus;
    expiresAt: string;
    version: number;
  };
}
