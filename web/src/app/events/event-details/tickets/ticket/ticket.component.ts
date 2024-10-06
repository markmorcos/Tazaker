import { Component, computed, inject, input } from '@angular/core';
import { Ticket } from '../tickets.service';
import { CardComponent } from '../../../../shared/card/card.component';
import { CurrencyPipe } from '@angular/common';
import { OrdersService } from '../../../../orders/orders.service';
import { Router, RouterLink } from '@angular/router';
import { UserService } from '../../../../auth/user.service';

@Component({
  selector: 'app-ticket',
  standalone: true,
  imports: [CardComponent, CurrencyPipe, RouterLink],
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css',
})
export class TicketComponent {
  private ordersService = inject(OrdersService);
  private userService = inject(UserService);
  private router = inject(Router);

  ticket = input.required<Ticket>();
  eventLink = input<boolean>();
  loading = this.ordersService.loading;
  canOrder = computed(
    () => this.ticket().userId != this.userService.currentUser()?.id
  );

  onOrderTicket(id: string) {
    this.ordersService.createOrder(id).subscribe({
      next: (order) => {
        this.router.navigate(['/profile', 'orders', order.id]);
      },
      error: () => {},
    });
  }
}
