import { Component } from '@angular/core';
import { CardComponent } from '../../shared/card/card.component';

@Component({
  selector: 'app-new-event',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './new-event.component.html',
  styleUrl: './new-event.component.css',
})
export class NewEventComponent {}
