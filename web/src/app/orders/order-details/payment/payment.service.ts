import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Order } from '../../orders.service';

export interface Payment {
  id: string;
  order: Order;
  paypalOrderId: string;
}

@Injectable({ providedIn: 'root' })
export class PaymentService {
  private httpClient = inject(HttpClient);

  createPayment(orderId: string) {
    return this.httpClient.post<Payment>('/api/orders/paypal', { orderId });
  }

  capturePayment(orderId: string, paypalOrderId: string) {
    return this.httpClient.post<Payment>('/api/payments', {
      orderId,
      paypalOrderId,
    });
  }
}
