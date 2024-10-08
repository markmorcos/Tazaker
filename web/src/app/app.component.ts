import {
  afterNextRender,
  Component,
  computed,
  DestroyRef,
  inject,
} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LandingComponent } from './landing/landing.component';
import { HeaderComponent } from './header/header.component';
import { UserService } from './auth/user.service';
import { environment } from '../environments/environment.development';
import { loadScript } from '@paypal/paypal-js';
import { FooterComponent } from './footer/footer.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LandingComponent, HeaderComponent, FooterComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  private userService = inject(UserService);
  private destroyRef = inject(DestroyRef);

  loading = computed(() => this.userService.loading());

  constructor() {
    afterNextRender(() => {
      loadScript({ clientId: environment.paypalClientId, currency: 'EUR' });

      const subscription = this.userService.getCurrentUser().subscribe();

      this.destroyRef.onDestroy(() => subscription.unsubscribe());
    });
  }
}
