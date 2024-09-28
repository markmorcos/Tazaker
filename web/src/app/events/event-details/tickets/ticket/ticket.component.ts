import { Component, inject, input } from '@angular/core';
import { Ticket } from '../tickets.service';
import { CardComponent } from '../../../../shared/card/card.component';
import { CurrencyPipe } from '@angular/common';
import { OrdersService } from '../../../../orders/orders.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CardComponent, CurrencyPipe],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css',
})
export class TicketComponent {
  private ordersService = inject(OrdersService);
  private router = inject(Router);

  ticket = input.required<Ticket>();
  loading = this.ordersService.loading;

  onOrderTicket(id: string) {
    this.ordersService.createOrder(id).subscribe({
      next: (order) => {
        this.router.navigate(['/orders', order.id]);
      },
      error: () => {},
    });
  }
}
