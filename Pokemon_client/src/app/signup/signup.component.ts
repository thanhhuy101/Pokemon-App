import { Component } from '@angular/core';
import { SharedModule } from '../shared/shared.module';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
})
export class SignupComponent {
  signupForm!: FormGroup;
  hidePassword = true;

  constructor(
    private authService: AuthService,
    private router: Router,
    private fB: FormBuilder,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.signupForm = this.fB.group({
      fullName: [null, [Validators.required]],
      email: [null, [Validators.required, Validators.email]],
      password: [null, [Validators.required]],
    });
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.snackBar.open('Please fill all required fields correctly', 'Close', {
        duration: 3000,
      });
      return;
    }

    const signupRequest = {
      fullName: this.signupForm.value.fullName,
      email: this.signupForm.value.email,
      password: this.signupForm.value.password,
    };

    this.authService.signup(signupRequest).subscribe({
      next: (response) => {
        this.snackBar.open('Registration successful! Please login.', 'Close', {
          duration: 3000,
        });
        this.router.navigate(['/login']);
      },
      error: (error) => {
        let errorMessage = 'Registration failed!';
        if (error.error?.message) {
          errorMessage = error.error.message;
        }
        this.snackBar.open(errorMessage, 'Close', {
          duration: 3000,
        });
      },
    });
  }
}
