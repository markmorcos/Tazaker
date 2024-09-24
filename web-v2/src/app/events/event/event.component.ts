import { Component, input } from '@angular/core';
import { Event } from '../events.service';
import { RouterLink } from '@angular/router';
import { CardComponent } from '../../shared/card/card.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [RouterLink, CardComponent, DatePipe],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css',
})
export class EventComponent {
  event = input.required<Event>();
}
