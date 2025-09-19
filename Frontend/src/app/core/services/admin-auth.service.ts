import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AdminAuthService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  validateAdminToken(): Observable<boolean> {
    const token = localStorage.getItem('adminToken');
    if (!token) return of(false);
    
    return this.http.post<boolean>(`${this.apiUrl}/admin/auth/validate`, { token });
  }

  getAdminProfile(): Observable<any> {
    return this.http.get(`${this.apiUrl}/admin/profile`);
  }

  isSuperAdmin(): boolean {
    return localStorage.getItem('adminRole') === 'SUPERADMIN';
  }

  isAdmin(): boolean {
    const role = localStorage.getItem('adminRole');
    return role === 'ADMIN' || role === 'SUPERADMIN';
  }

  getAdminName(): string {
    return localStorage.getItem('adminName') || '';
  }

  getAdminRole(): string {
    return localStorage.getItem('adminRole') || '';
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/admin/auth/logout`, {});
  }

  clearAdminSession(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminRole');
    localStorage.removeItem('adminName');
  }
}