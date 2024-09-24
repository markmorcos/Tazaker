import { Component, input } from '@angular/core';
import { AlertComponent } from '../alert/alert.component';

export interface Error {
  field: string;
  message: string;
}

@Component({
  selector: 'app-error',
  standalone: true,
  imports: [AlertComponent],
  templateUrl: './error.component.html',
  styleUrl: './error.component.css',
})
export class ErrorComponent {
  errors = input<Error[]>([]);
}
