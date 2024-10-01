import {
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
} from '@angular/core';
import { Event, EventsService } from '../events.service';
import { CardComponent } from '../../shared/card/card.component';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { TicketsComponent } from './tickets/tickets.component';

@Component({
  selector: 'app-event-details',
  standalone: true,
  imports: [CardComponent, RouterLink, RouterOutlet, TicketsComponent],
  templateUrl: './event-details.component.html',
  styleUrl: './event-details.component.css',
})
export class EventDetailsComponent implements OnInit {
  private router = inject(Router);
  private eventsService = inject(EventsService);
  private destroyRef = inject(DestroyRef);

  id = input.required<string>();
  event = signal<Event | undefined>(undefined);
  loading = this.eventsService.loading;

  ngOnInit() {
    const subscription = this.eventsService.getEvent(this.id()).subscribe({
      next: (event) => {
        this.event.set(event);
      },
      error: (error) => {
        this.router.navigate(['/events']);
      },
    });

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
