import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of, map } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment';

interface LoginRequest {
  username: string;
  password: string;
}

interface LoginResponse {
  token: string;
  id: number;
  username: string;
  email: string;
  role: string;
}

interface AdminLoginResponse {
  success: boolean;
  username: string;
  role: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  phone: string;
  gender: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = environment.apiUrl;
  private currentUserSubject = new BehaviorSubject<User | null>(this.loadUserFromStorage());
  currentUser$ = this.currentUserSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<boolean> {
    const loginRequest: LoginRequest = { username, password };

    return this.http.post<LoginResponse>(`${this.apiUrl}/auth/login`, loginRequest)
      .pipe(
        tap(response => {
          const user: User = {
            id: response.id,
            username: response.username,
            email: response.email,
            phone: '',
            gender: '',
            password: ''
          };
          this.currentUserSubject.next(user);
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('token', response.token);
        }),
        map(() => true),
        catchError(() => of(false))
      );
  }

  logout(): void {
    this.currentUserSubject.next(null);
    localStorage.removeItem('currentUser');
    localStorage.removeItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  updateCurrentUser(updatedUser: User): void {
    this.currentUserSubject.next(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  }

  register(user: User): Observable<any> {
    const registerRequest: RegisterRequest = {
      username: user.username,
      email: user.email,
      phone: user.phone,
      gender: user.gender,
      password: user.password
    };

    return this.http.post(`${this.apiUrl}/auth/register`, registerRequest);
  }

  adminLogin(username: string, password: string): Observable<AdminLoginResponse> {
    const loginRequest: LoginRequest = { username, password };
    console.log('Making login request to:', `${this.apiUrl}/admin/auth/login`);

    return this.http.post<LoginResponse>(`${this.apiUrl}/admin/auth/login`, loginRequest)
      .pipe(
        map(response => {
          console.log('Backend response:', response);
          if (response.role === 'ADMIN' || response.role === 'SUPERADMIN') {
            return {
              success: true,
              username: response.username,
              role: response.role
            };
          }
          return { success: false, username: '', role: '' };
        }),
        catchError(error => {
          console.error('HTTP Error:', error);
          return of({ success: false, username: '', role: '' });
        })
      );
  }

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(`${this.apiUrl}/users/list`);
  }

  createUser(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/users`, user);
  }

  updateUser(id: number, user: User): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/users/${id}`, user);
  }

  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`);
  }

  private loadUserFromStorage(): User | null {
    const userJson = localStorage.getItem('currentUser');
    return userJson ? JSON.parse(userJson) : null;
  }
}
