import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, of, tap } from 'rxjs';

export interface Ticket {
  id: string;
  userId: string;
  eventId: string;
  price: number;
  fees: number;
  total: number;
  fileId: string;
}

@Injectable({ providedIn: 'root' })
export class TicketsService {
  private httpClient = inject(HttpClient);

  loading = signal(true);
  tickets = signal<Ticket[]>([]);

  createTicket(eventId: string, price: string, file: File) {
    this.loading.set(true);

    const formData = new FormData();
    formData.append('eventId', eventId);
    formData.append('price', price);
    formData.append('file', file);

    const previousTickets = this.tickets();
    return this.httpClient.post<Ticket>('/api/tickets', formData).pipe(
      tap({
        next: (ticket) => {
          this.tickets.set([...previousTickets, ticket]);
          this.loading.set(false);
          return of(ticket);
        },
        error: () => {
          this.loading.set(false);
        },
      })
    );
  }

  getTickets(eventId: string) {
    this.loading.set(true);
    return this.httpClient
      .get<Ticket[]>(`/api/tickets?eventId=${eventId}`)
      .pipe(
        tap({
          next: (tickets) => {
            this.tickets.set(tickets);
            this.loading.set(false);
          },
          error: () => {
            this.loading.set(false);
          },
        })
      );
  }
}
