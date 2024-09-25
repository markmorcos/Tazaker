import { Component, DestroyRef, inject, input } from '@angular/core';
import { CardComponent } from '../../../shared/card/card.component';
import { TicketsService } from './tickets.service';
import { TicketComponent } from './ticket/ticket.component';

@Component({
  selector: 'app-tickets',
  standalone: true,
  imports: [CardComponent, TicketComponent],
  templateUrl: './tickets.component.html',
  styleUrl: './tickets.component.css',
})
export class TicketsComponent {
  private ticketsService = inject(TicketsService);
  private destroyRef = inject(DestroyRef);

  eventId = input.required<string>();
  tickets = this.ticketsService.tickets;
  loading = this.ticketsService.loading;

  ngOnInit() {
    const subscription = this.ticketsService
      .getTickets(this.eventId())
      .subscribe();

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
