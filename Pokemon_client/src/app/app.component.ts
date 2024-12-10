import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared/shared.module';
import { AuthService } from './services/auth/auth.service';
import { UserStorageService } from './services/userstorage/userstorage.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, SharedModule, RouterLink],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'Pokemon_client';
  isLoggedIn = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private userStorage: UserStorageService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.userStorage.isLoggedIn();

    this.authService.isLoggedIn$.subscribe((loggedIn) => {
      this.isLoggedIn = loggedIn;
    });
  }

  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.userStorage.clear();
        this.authService.isLoggedInSubject.next(false);
        this.router.navigate(['/login']);
      },
      error: (error) => {
        console.error('Logout error:', error);
        // Vẫn logout ở client side nếu có lỗi
        this.userStorage.clear();
        this.authService.isLoggedInSubject.next(false);
        this.router.navigate(['/login']);
      },
    });
  }
}
