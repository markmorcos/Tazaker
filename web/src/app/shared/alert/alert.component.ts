import { Component, input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [],
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css',
  host: {
    '[class.success]': 'type() === "success"',
    '[class.danger]': 'type() === "danger"',
    '[class.warning]': 'type() === "warning"',
  },
})
export class AlertComponent {
  type = input.required<'success' | 'danger' | 'warning'>();
}
