import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { UserService } from '../../../core/services/user-service';
import { User } from '../../../core/models/user.model';
import { Router, RouterLink } from '@angular/router';
import { CanComponentDeactivate } from '../../../core/guards/unsaved-changes.guard';
import { Header } from '../../../layout/header/header';

@Component({
  selector: 'app-user-register',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterLink, Header ],
  templateUrl: './user-register.html',
  styleUrls: ['./user-register.css']
})
export class UserRegister implements CanComponentDeactivate {
  registrationForm: FormGroup;
  private formSubmitted = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.registrationForm = this.fb.group({
      username: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.pattern(/^[A-Za-z][A-Za-z0-9]*$/)
      ]],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      gender: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  // Custom validator to check if password and confirmPassword match
  passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password && confirmPassword && password !== confirmPassword
      ? { passwordMismatch: true }
      : null;
  }

  // Called when the form is submitted
  onSubmit(): void {
    if (this.registrationForm.valid) {
      const newUser: User = {
        username: this.registrationForm.value.username,
        email: this.registrationForm.value.email,
        phone: this.registrationForm.value.phone,
        gender: this.registrationForm.value.gender,
        password: this.registrationForm.value.password
      };

      this.userService.register(newUser).subscribe({
        next: (response) => {
          this.formSubmitted = true;
          console.log('Registration Successful:', response);
          alert('Registration Successful! You can now log in.');
          this.router.navigate(['/login']);
        },
        error: (error) => {
          console.error('Registration failed:', error);
          alert('Registration failed: ' + (error.error || 'Please try again.'));
        }
      });
    } else {
      this.markFormGroupTouched();
      this.logValidationErrors();
      alert('Please fix the errors before submitting.');
    }
  }

  // Marks all form controls as touched to trigger validation messages
  private markFormGroupTouched(): void {
    Object.values(this.registrationForm.controls).forEach(control => {
      control.markAsTouched();
      control.updateValueAndValidity();
    });
  }

  // Logs validation errors to the console for debugging
  private logValidationErrors(): void {
    console.log('Form Errors:', this.registrationForm.errors);
    Object.keys(this.registrationForm.controls).forEach(key => {
      const controlErrors = this.registrationForm.get(key)?.errors;
      if (controlErrors) {
        console.log(`${key} errors:`, controlErrors);
      }
    });
  }

  // Used in template for cleaner access to form controls
  get f() {
    return this.registrationForm.controls;
  }

  // CanDeactivate guard method
  canDeactivate(): boolean {
    if (this.registrationForm.dirty && !this.formSubmitted) {
      return confirm('You have unsaved changes. Do you really want to leave this page?');
    }
    return true;
  }
}
