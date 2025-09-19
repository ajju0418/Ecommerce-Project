import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AdminGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    const isAdmin = localStorage.getItem('isAdmin') === 'true';
    console.log('AdminGuard check - isAdmin:', isAdmin);
    console.log('LocalStorage isAdmin value:', localStorage.getItem('isAdmin'));

    if (isAdmin) {
      console.log('AdminGuard: Access granted');
      return true;
    }

    console.log('AdminGuard: Access denied, redirecting to login');
    this.router.navigate(['/adminlogin']);
    return false;
  }
}
