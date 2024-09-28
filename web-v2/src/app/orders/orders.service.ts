import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';

interface StatusInfo {
  title: string;
  background: string;
}

export interface Order {
  id: string;
  ticket: {
    id: string;
    price: number;
    event: { id: string; title: string };
  };
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

  orders = signal<Order[]>([]);
  loading = signal(false);

  createOrder(ticketId: string) {
    this.loading.set(true);
    const previousOrders = this.orders();
    return this.httpClient.post<Order>('/api/orders', { ticketId }).pipe(
      tap({
        next: (order) => {
          this.orders.set([...previousOrders, order]);
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
        next: (orders) => {
          this.orders.set(orders);
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      })
    );
  }

  getOrder(id: string) {
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
