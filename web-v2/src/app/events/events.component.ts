import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../shared/card/card.component';
import { Event, EventsService } from './events.service';
import { EventComponent } from './event/event.component';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [RouterLink, CardComponent, EventComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css',
})
export class EventsComponent implements OnInit {
  private eventsService = inject(EventsService);
  private destroyRef = inject(DestroyRef);

  events = signal<Event[]>([]);
  loading = this.eventsService.loading;

  ngOnInit() {
    const subscription = this.eventsService.getEvents().subscribe({
      next: (events) => {
        this.events.set(events);
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
