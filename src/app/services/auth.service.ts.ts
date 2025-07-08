// src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'https://localhost:7047/api/Auth';

  constructor(private http: HttpClient, private router: Router) {}

  login(username: string, password: string) {
    return this.http.post<any>(`${this.baseUrl}/Login`, { username, password });
  }

  saveTokens(access: string, refresh: string) {
    localStorage.setItem('accessToken', access);
    localStorage.setItem('refreshToken', refresh);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('accessToken');
  }

  setUserRole(role: string) {
    localStorage.setItem('userRole', role);
  }

  getUserRole(): string | null {
    return localStorage.getItem('userRole');
  }

  validateToken(): boolean {
    try {
      let token = localStorage.getItem('accessToken');
      if (!token) return false;
      const payload = JSON.parse(atob(token.split('.')[1]));
      const exp = payload.exp;
      const now = Math.floor(Date.now() / 1000);
      if (exp > now) return true;
      console.log('test');
      this.logout();
      return false;
    } catch (e) {
      return false;
    }
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('userRole');
    this.router.navigate(['/login']);
  }

  getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
  }
}
