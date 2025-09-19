import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user-service';
import { Header } from "../../../layout/header/header";

@Component({
  selector: 'app-user-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule, Header],
  templateUrl: './user-login.html',
  styleUrls: ['./user-login.css']
})
export class UserLogin {
  loginForm: FormGroup;
  loginError = false;
  errorMessage = '';
  showPassword = false;
  constructor(
    private fb: FormBuilder,
    private router: Router,
    private userService: UserService
  ) {
    this.loginForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[A-Za-z][A-Za-z0-9]*$/)
      ]],
      password: ['', [
        Validators.required,
        Validators.minLength(6)
      ]]
    });
  }

  onSubmit(): void {
    this.loginError = false;
    this.errorMessage = '';

    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      
      this.userService.login(username, password).subscribe({
        next: (success) => {
          if (success) {
            this.router.navigate(['/home']);
          }
        },
        error: (error) => {
          this.loginError = true;
          this.errorMessage = 'Invalid username or password. Please try again.';
          console.error('Login failed:', error);
        }
      });
    } else {
      this.markFormGroupTouched(this.loginForm);
    }
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach((control: any) => {
      control.markAsTouched();
      if (control.controls) {
        this.markFormGroupTouched(control);
      }
    });
  }
  togglePasswordVisibility(): void {
  this.showPassword = !this.showPassword;
}
}
