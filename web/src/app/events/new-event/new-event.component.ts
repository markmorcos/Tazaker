import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Event, EventsService } from '../events.service';
import { Router } from '@angular/router';
import { InputComponent } from '../../shared/input/input.component';
import { CardComponent } from '../../shared/card/card.component';

@Component({
  selector: 'app-new-event',
  standalone: true,
  imports: [ReactiveFormsModule, InputComponent, CardComponent],
  templateUrl: './new-event.component.html',
  styleUrl: './new-event.component.css',
})
export class NewEventComponent {
  private eventsService = inject(EventsService);
  private router = inject(Router);

  event = new FormGroup({
    title: new FormControl('Tome Forró Berlin Anniversary', {
      validators: [Validators.required],
    }),
    url: new FormControl(
      'https://service.filora.eu/plugin/event/fd423fa6-2f2b-4fa6-a036-f9b4c487e439',
      { validators: [Validators.required] }
    ),
    image: new FormControl(
      'https://api.filora.eu/events/fd423fa6-2f2b-4fa6-a036-f9b4c487e439/event_picture/',
      { validators: [Validators.required] }
    ),
    start: new FormControl('2025-06-12T15:00:00', {
      validators: [Validators.required],
    }),
    end: new FormControl('2025-06-15T23:55:00', {
      validators: [Validators.required],
    }),
    timezone: new FormControl('Europe/Berlin', {
      validators: [Validators.required],
    }),
  });

  onSubmit() {
    console.log(this.event.value);
    if (this.event.invalid) {
      return;
    }

    const event: Partial<Event> = {
      title: this.event.value.title!,
      url: this.event.value.url!,
      image: this.event.value.image!,
      start: this.event.value.start! + 'Z',
      end: this.event.value.end! + 'Z',
      timezone: this.event.value.timezone!,
    };

    this.eventsService.createEvent(event).subscribe({
      next: () => {
        this.router.navigate(['/events']);
      },
    });
  }

  onCancel() {
    this.router.navigate(['/events']);
  }
}
