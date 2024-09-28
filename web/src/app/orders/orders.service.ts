import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';
import { Ticket } from '../events/event-details/tickets/tickets.service';

interface StatusInfo {
  title: string;
  background: string;
}

export interface Order {
  id: string;
  ticket: Ticket & { event: { id: string; title: string } };
  expiresAt: string;
  status: string;
  statusInfo: StatusInfo;
}

const statusMap: { [key: string]: StatusInfo } = {
  created: { title: 'Started', background: 'primary' },
  expired: { title: 'Expired', background: 'danger' },
  complete: { title: 'Complete', background: 'success' },
};

const orderMapper = (order: Order) => ({
  ...order,
  statusInfo: statusMap[order.status],
});

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private httpClient = inject(HttpClient);

  loading = signal(false);

  createOrder(ticketId: string) {
    this.loading.set(true);
    return this.httpClient.post<Order>('/api/orders', { ticketId }).pipe(
      tap({
        next: () => {
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      })
    );
  }

  getOrders() {
    this.loading.set(true);
    return this.httpClient.get<Order[]>('/api/orders').pipe(
      map((orders) => orders.map(orderMapper)),
      tap({
        next: () => {
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      })
    );
  }

  getOrder(id: string) {
    this.loading.set(true);
    return this.httpClient.get<Order>(`/api/orders/${id}`).pipe(
      map(orderMapper),
      tap({
        next: () => {
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      })
    );
  }
}
