import { Component, inject, signal } from '@angular/core';
import { Order, OrdersService } from '../orders.service';
import { CardComponent } from '../../shared/card/card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [CardComponent, RouterLink],
  templateUrl: './sales.component.html',
  styleUrl: './sales.component.css',
})
export class SalesComponent {
  private ordersService = inject(OrdersService);

  orders = signal<Order[]>([]);
  loading = this.ordersService.loading;

  ngOnInit() {
    this.ordersService.getSales().subscribe({
      next: (orders) => {
        this.orders.set(orders);
      },
    });
  }
}
