import { Component, inject, OnInit } from '@angular/core';
import { CardComponent } from '../shared/card/card.component';
import { OrdersService } from './orders.service';
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

  orders = this.ordersService.orders;
  loading = this.ordersService.loading;

  ngOnInit() {
    this.ordersService.getOrders().subscribe();
  }
}
