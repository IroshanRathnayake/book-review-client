import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { User } from '../../../model/user.model';
import { CommonModule } from '@angular/common';
import { Alert, AlertService } from '../../../shared/services/alert.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterLink],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})
export class SignupComponent implements OnInit{
  registerForm: FormGroup;
  isLoading = false;
  isLoggedIn = false;
  error = '';
  currentStep: number = 1;
  private user: User = {} as User;
  private alerts: Alert[] = [];

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService, 
    private router: Router,
    private alertService: AlertService
  
  ) {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(5)]],
        confirmPassword: ['', [Validators.required, Validators.minLength(5)]],
        username: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
        firstname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
        lastname: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
        checkbox: [true, [Validators.requiredTrue]],
      },
      {
        validators: this.passwordMatchValidator, 
      }
    );
  }
  ngOnInit(): void {
    this.alertService.alert$.subscribe((alerts) => {
      this.alerts = alerts;
    });
  }

   // Custom validator to check if passwords match
   passwordMatchValidator(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordsMismatch: true }
      : null;
  }

  async onSubmit(): Promise<void> {
    this.isLoading = true;
    this.error = '';
    
    if (this.registerForm.valid) {
      
      const { email, password, confirmPassword, username, firstname, lastname } = this.registerForm.value;

      // Check if passwords match
      if (password !== confirmPassword) {
        this.error = 'Passwords do not match!';
        this.isLoading = false;
        return;
      }

      this.user = {
        userName: username,
        firstName: firstname,
        lastName: lastname,
        email: email,
        password: password,
      } 
      console.log(this.user);
      

      (await this.authService.register(this.user)).subscribe({
        next: () => {
          this.isLoading = false;
          console.log('Registerd successful');
          this.isLoggedIn = true;
          this.alertService.showAlert('success', 'Registration successful');
          this.router.navigate(['auth/login']);
        },
        error: (error) => {
          this.isLoading = false;
          this.error = error.error.message || 'An error occurred during registration';
  
        }
      });
    } else {
      this.error = 'Please fill all required fields correctly.';
      this.isLoading = false;
    }
  }

  nextStep() {
    if (this.registerForm.valid || this.currentStep < 3) {
      this.currentStep++;
    }
  }

  previousStep() {
    this.currentStep--;
  }

  // Handling checkbox changes
  onCheckboxChange(isChecked: boolean) {
    if (isChecked) {
      this.currentStep = 4;
    } else {
      this.currentStep = 3;
    }
  }
}
