import { Component, inject, OnInit, signal } from '@angular/core';
import { CardComponent } from '../shared/card/card.component';
import { Order, OrdersService } from './orders.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CardComponent, RouterLink],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent implements OnInit {
  private ordersService = inject(OrdersService);

  orders = signal<Order[]>([]);
  loading = this.ordersService.loading;

  ngOnInit() {
    this.ordersService.getOrders().subscribe({
      next: (orders) => {
        this.orders.set(orders);
      },
    });
  }
}
