import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../../../core/services/user-service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './adminlogin.html',
  styleUrl: './adminlogin.css'
})
export class Adminlogin {
  loginForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router, private userService: UserService) {
    this.loginForm = this.fb.group({
      adminId: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

onSubmit() {
  if (this.loginForm.valid) {
    const { adminId, password } = this.loginForm.value;
    console.log('Attempting login with:', adminId);

    this.userService.adminLogin(adminId, password).subscribe({
      next: (response) => {
        console.log('Login response:', response);
        if (response.success) {
          localStorage.setItem('isAdmin', 'true');
          localStorage.setItem('adminRole', response.role);
          localStorage.setItem('adminName', response.username);
          console.log('LocalStorage set, navigating to admin dashboard...');
          this.router.navigateByUrl('/admin/dashboard');
        } else {
          alert('Invalid credentials');
        }
      },
      error: (error) => {
        console.error('Login error:', error);
        if (error.status === 0) {
          alert('Cannot connect to server. Please ensure the backend is running on port 8081.');
        } else if (error.status === 400) {
          alert('Invalid credentials');
        } else {
          alert(`Login failed: ${error.message || 'Unknown error'}`);
        }
      }
    });
  } else {
    this.markFormGroupTouched();
  }
}


  private markFormGroupTouched() {
    Object.keys(this.loginForm.controls).forEach(key => {
      const control = this.loginForm.get(key);
      control?.markAsTouched();
    });
  }
}
