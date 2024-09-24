import { Component, signal } from '@angular/core';
import { CardComponent } from '../shared/card/card.component';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.css',
})
export class OrdersComponent {
  orders = signal([]);
}
