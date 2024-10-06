import { Component, inject, signal } from '@angular/core';
import { CardComponent } from '../../shared/card/card.component';
import {
  Ticket,
  TicketsService,
} from '../../events/event-details/tickets/tickets.service';
import { TicketComponent } from '../../events/event-details/tickets/ticket/ticket.component';

@Component({
  selector: 'app-listings',
  standalone: true,
  imports: [CardComponent, TicketComponent],
  templateUrl: './listings.component.html',
  styleUrl: './listings.component.css',
})
export class ListingsComponent {
  private ticketsService = inject(TicketsService);

  tickets = signal<Ticket[]>([]);
  loading = this.ticketsService.loading;

  ngOnInit() {
    this.ticketsService.getTicketListings().subscribe({
      next: (tickets) => {
        this.tickets.set(tickets);
      },
    });
  }
}
