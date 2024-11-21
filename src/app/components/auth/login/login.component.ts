import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { AlertComponent } from "../../../shared/alert/alert.component";
import { Alert, AlertService } from '../../../shared/services/alert.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AlertComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  error = '';
  isLoggedIn = false;
  alerts: Alert[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    private alertService: AlertService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
    });
  }

  ngOnInit(): void {
    this.alertService.alert$.subscribe((alerts) => {
      this.alerts = alerts;
    });

    if (this.authService.isAuthenticated()) {
      this.isLoggedIn = true;
      this.router.navigate(['dashboard']);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) return;

    this.isLoading = true;
    this.error = '';

    const { email, password } = this.loginForm.value;

    (await this.authService.login(email, password)).subscribe({
      next: () => {
        this.isLoading = false;
        this.isLoggedIn = true;
        this.router.navigate(['dashboard']);
      },
      error: (err) => {
        console.log(err);
        
        this.isLoading = false;
        if (err.status === 401) {
          this.error = 'Unauthorized: Invalid email or password.';
        } else {
          this.error = err?.error?.message || 'An error occurred during login';
        }
        this.alertService.showAlert('error', this.error);
      },
      complete: () => {
        console.log('Login process complete.');
      }
    });
  }

  showSuccess() {
    this.alertService.showAlert('success', 'Login successful!');
  }

  showError() {
    this.alertService.showAlert('error', 'Something went wrong!');
  }
}
