import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CardComponent } from '../../shared/card/card.component';
import { AlertComponent } from '../../shared/alert/alert.component';
import { Error, ErrorComponent } from '../../shared/error/error.component';
import { AuthService } from '../auth.service';
import { InputComponent } from '../../shared/input/input.component';
import { ButtonComponent } from '../../shared/button/button.component';

@Component({
  selector: 'app-start',
  standalone: true,
  imports: [
    FormsModule,
    CardComponent,
    AlertComponent,
    ErrorComponent,
    InputComponent,
    ButtonComponent,
  ],
  templateUrl: './start.component.html',
  styleUrl: './start.component.css',
})
export class StartComponent {
  private authService = inject(AuthService);

  email = signal('');
  loading = computed(() => this.authService.loading());
  success = signal(false);
  errors = signal<Error[]>([]);

  onSubmit() {
    this.authService.signIn(this.email()).subscribe({
      next: () => {
        this.success.set(true);
      },
      error: (error) => {
        const errors: Error[] = error?.error?.errors || [];
        this.errors.set(errors);
      },
    });
  }
}
