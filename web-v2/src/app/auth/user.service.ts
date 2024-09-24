import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { map, tap } from 'rxjs';

export interface User {
  id: number;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserService {
  private httpClient = inject(HttpClient);

  currentUser = signal<User | undefined>(undefined);
  loading = signal(true);

  getCurrentUser() {
    this.loading.set(true);
    return this.httpClient
      .get<{ currentUser: User }>('/api/users/current')
      .pipe(
        map(({ currentUser }) => currentUser),
        tap({
          next: (currentUser) => {
            this.currentUser.set(currentUser);
            this.loading.set(false);
          },
          error: () => {
            this.currentUser.set(undefined);
            this.loading.set(false);
          },
        })
      );
  }
}
