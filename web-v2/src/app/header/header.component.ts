import { Component, computed, inject } from '@angular/core';
import { ButtonComponent } from '../shared/button/button.component';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../auth/user.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  private authService = inject(AuthService);
  private userService = inject(UserService);
  private router = inject(Router);

  email = computed(() => this.userService.currentUser()?.email);
  links = computed(() => {
    if (this.userService.loading()) {
      return [];
    }

    if (this.userService.currentUser()) {
      return [
        { label: 'Profile', href: ['/profile'] },
        { label: 'Events', href: ['/events'] },
        { label: 'Orders', href: ['/orders'] },
      ];
    }

    return [{ label: 'Start', href: ['/start'] }];
  });

  onSignOut() {
    this.authService.signOut().subscribe(() => {
      this.router.navigate(['/']);
    });
  }
}
