import { Component } from '@angular/core';
import { CardComponent } from '../shared/card/card.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {}
