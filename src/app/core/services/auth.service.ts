import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { AuthResponse, User } from '../../model/user.model';
import { Router } from '@angular/router';
import Cookies from 'js-cookie';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly API_URL = `${environment.BASE_URL}/api/auth`;

  constructor(private http: HttpClient, private router: Router) {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      const parsedUser: AuthResponse = JSON.parse(savedUser);
      this.currentUserSubject.next(parsedUser.user);
    }
  }

  async login(
    email: string,
    password: string
  ): Promise<Observable<AuthResponse>> {
    return this.http
      .post<AuthResponse>(
        `${this.API_URL}/login`,
        { email, password },
        {
          responseType: 'json',
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        }
      )
      .pipe(
        tap((response) => {
          Cookies.set('token', response.token, { expires: 1 / 24 });
          localStorage.setItem('user', JSON.stringify(response.user));
          this.currentUserSubject.next(response.user);
          sessionStorage.setItem('oneTimeData', 'false');
        })
      );
  }

  async register(user: User): Promise<Observable<AuthResponse>> {
    return this.http
      .post<AuthResponse>(`${this.API_URL}/signup`, user, {
        responseType: 'json',
        headers: new HttpHeaders({
          'Content-Type': 'application/json',
        }),
      })
      .pipe(
        tap((response) => {
          console.log(response);
        })
      );
  }

  logout(): void {
    Cookies.remove('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    sessionStorage.setItem('oneTimeData', 'false');
    this.router.navigate(['/auth/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    return Cookies.get('token') || null;
  }

  getCurrentUser(): User | null {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser: User = JSON.parse(savedUser);
      return parsedUser;
    }
    return null;
  }
}
