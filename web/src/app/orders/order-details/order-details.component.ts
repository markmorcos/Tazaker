import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Order, OrdersService } from '../orders.service';
import { CardComponent } from '../../shared/card/card.component';
import { PaymentComponent } from './payment/payment.component';
import { AlertComponent } from '../../shared/alert/alert.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-order',
  standalone: true,
  imports: [CardComponent, PaymentComponent, AlertComponent, RouterLink],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css',
})
export class OrderDetailsComponent implements OnInit {
  private ordersService = inject(OrdersService);
  private destroyRef = inject(DestroyRef);

  id = input.required<string>();
  order = signal<Order | undefined>(undefined);
  loading = this.ordersService.loading;

  timeLeft = signal(0);

  ngOnInit() {
    let interval: NodeJS.Timeout;

    const subscription = this.ordersService.getOrder(this.id()).subscribe({
      next: (order) => {
        this.order.set(order);
        interval = this.updateTimeLeft();
      },
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
      clearInterval(interval);
    });
  }

  onPaymentSuccess() {
    this.ordersService.getOrder(this.id()).subscribe({
      next: (order) => {
        this.order.set(order);
      },
    });
  }

  findTimeLeft() {
    const msLeft = new Date(this.order()!.expiresAt).getTime() - Date.now();
    this.timeLeft.set(Math.round(msLeft / 1000 / 60));
  }

  updateTimeLeft() {
    this.findTimeLeft();
    return setInterval(() => this.findTimeLeft(), 1000);
  }
}
