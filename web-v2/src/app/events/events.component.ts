import {
  afterNextRender,
  Component,
  DestroyRef,
  inject,
  OnInit,
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../shared/card/card.component';
import { EventsService } from './events.service';
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

  events = this.eventsService.events;

  ngOnInit() {
    const subscription = this.eventsService.getEvents().subscribe();

    this.destroyRef.onDestroy(() => subscription.unsubscribe());
  }
}
