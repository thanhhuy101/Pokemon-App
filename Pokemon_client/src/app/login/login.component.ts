import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../services/auth/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UserStorageService } from '../services/userstorage/userstorage.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterLink, SharedModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  loginForm!: FormGroup;

  hidePassword = true;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private userStorageService: UserStorageService
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const loginData = this.loginForm.value;

      this.authService.login(loginData).subscribe({
        next: (response) => {
          this.userStorageService.saveToken(response.token);
          this.userStorageService.saveUser(response);

          this.authService.isLoggedInSubject.next(true);

          this.snackBar.open('Login successfully', 'Close', {
            duration: 3000,
            panelClass: ['success-snackbar'],
          });

          this.router.navigate(['/landing-page/homepage']);
        },
        error: (error) => {
          this.snackBar.open(error.error.message || 'Login failed', 'Close', {
            duration: 3000,
            panelClass: ['error-snackbar'],
          });
        },
      });
    } else {
      Object.keys(this.loginForm.controls).forEach((key) => {
        const control = this.loginForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
  // onSubmit() {
  //   if (this.loginForm.valid) {
  //     const loginData = {
  //       email: this.loginForm.value.email,
  //       password: this.loginForm.value.password,
  //     };

  //     this.authService.login(loginData).subscribe({
  //       next: (response) => {
  //         this.snackBar.open('Login successful!', 'Close', {
  //           duration: 3000,
  //           horizontalPosition: 'right',
  //           verticalPosition: 'top',
  //         });
  //         this.router.navigate(['/homepage']);
  //       },
  //       error: (error) => {
  //         let errorMessage = 'Login failed';
  //         if (error.error?.message) {
  //           errorMessage = error.error.message;
  //         }
  //         this.snackBar.open(errorMessage, 'Close', {
  //           duration: 3000,
  //           horizontalPosition: 'right',
  //           verticalPosition: 'top',
  //           panelClass: ['error-snackbar'],
  //         });
  //       },
  //     });
  //   } else {
  //     this.snackBar.open('Please fill all required fields correctly', 'Close', {
  //       duration: 3000,
  //       horizontalPosition: 'right',
  //       verticalPosition: 'top',
  //     });
  //     Object.keys(this.loginForm.controls).forEach((key) => {
  //       const control = this.loginForm.get(key);
  //       if (control?.invalid) {
  //         control.markAsTouched();
  //       }
  //     });
  //   }
  // }
}
