import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { of, tap } from 'rxjs';

export interface Event {
  id: string;
  title: string;
  url: string;
  image: string;
  start: string;
  end: string;
  timezone: string;
}

@Injectable({ providedIn: 'root' })
export class EventsService {
  private httpClient = inject(HttpClient);

  loading = signal(true);

  getEvents() {
    this.loading.set(true);
    return this.httpClient.get<Event[]>('/api/events').pipe(
      tap({
        next: (events) => {
          this.loading.set(false);
          return of(events);
        },
        error: () => {
          this.loading.set(false);
        },
      })
    );
  }

  getEvent(id: string) {
    this.loading.set(true);
    return this.httpClient.get<Event>(`/api/events/${id}`).pipe(
      tap({
        next: () => {
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      })
    );
  }

  createEvent(event: Partial<Event>) {
    this.loading.set(true);
    return this.httpClient.post<Partial<Event>>('/api/events', event).pipe(
      tap({
        next: () => {
          this.loading.set(false);
        },
        error: () => {
          this.loading.set(false);
        },
      })
    );
  }
}
