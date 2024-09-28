import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';
import { UserService } from './user.service';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
} from '@angular/router';

export interface User {
  id: number;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private httpClient = inject(HttpClient);
  private userService = inject(UserService);

  loading = signal(false);

  signIn(email: string) {
    this.loading.set(true);
    return this.httpClient.post('/api/auth/start', { email }).pipe(
      tap({
        next: () => {
          this.loading.set(false);
        },
      })
    );
  }

  signOut() {
    this.loading.set(true);
    return this.httpClient.post('/api/auth/sign-out', {}).pipe(
      tap({
        next: () => {
          this.userService.currentUser.set(undefined);
          this.loading.set(false);
        },
      })
    );
  }
}

export const canAuth =
  (authenticated: boolean, fallback: string[]) =>
  (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const userService = inject(UserService);
    const router = inject(Router);

    console.log(
      'canAuth',
      authenticated,
      fallback,
      !!userService.currentUser()
    );

    if (!!userService.currentUser() === authenticated) {
      router.navigate(fallback);
      return false;
    }

    return true;
  };
