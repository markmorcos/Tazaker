import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, of, tap, throwError } from 'rxjs';

export interface Event {
  id: string;
  title: string;
  url: string;
  image: string;
  start: string;
  end: string;
  timezone: string;
}

const dummy = [
  {
    id: '1',
    title: 'Event 1',
    url: 'https://google.com',
    image: 'https://placehold.it/200x200',
    start: '2025-01-01T00:00:00Z',
    end: '2026-01-01T01:00:00Z',
    timezone: 'Europe/Berlin',
  },
  {
    id: '2',
    title: 'Event 2',
    url: 'https://google.com',
    image: 'https://placehold.it/200x200',
    start: '2025-01-01T00:00:00Z',
    end: '2026-01-01T01:00:00Z',
    timezone: 'Europe/Berlin',
  },
  {
    id: '3',
    title: 'Event 3',
    url: 'https://google.com',
    image: 'https://placehold.it/200x200',
    start: '2025-01-01T00:00:00Z',
    end: '2026-01-01T01:00:00Z',
    timezone: 'Europe/Berlin',
  },
];

@Injectable({ providedIn: 'root' })
export class EventsService {
  private httpClient = inject(HttpClient);

  loading = signal(true);

  events = signal<Event[]>([]);

  getEvents() {
    this.loading.set(true);
    return this.httpClient.get<Event[]>('/api/events').pipe(
      tap({
        next: (events) => {
          this.events.set(events);
          this.loading.set(false);
        },
      })
    );
  }

  getEvent(id: string) {
    this.loading.set(true);
    const event = this.events().find((event) => event.id === id);

    if (!event) {
      return throwError(() => `Event with id ${id} not found`);
    }

    return of<Event>(event).pipe(
      tap({
        next: () => this.loading.set(false),
      })
    );
  }
}
