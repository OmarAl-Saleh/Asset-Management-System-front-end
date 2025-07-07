import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Options } from '../../types';
import { AuthService } from './auth.service.ts'; // adjust path if needed
import as from '@angular/common/locales/extra/as';

@Injectable({ providedIn: 'root' })
export class Api {
  private baseUrl = 'https://localhost:7047/api';

  constructor(private http: HttpClient, private auth: AuthService) {}

  private getAuthHeaders(): { [header: string]: string } {
    const token = this.auth.getAccessToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  getAll<T>(endpoint: string, options: any = {}): Observable<T> {
    const headers = this.getAuthHeaders();
    return this.http.get<T>(`${this.baseUrl}/${endpoint}`, {
      ...options,
      headers: { ...headers, ...(options?.headers || {}) },
    }) as Observable<T>;
  }

  getById<T>(
    endpoint: string,
    id: number | string,
    options: any = {}
  ): Observable<T> {
    const headers = this.getAuthHeaders();
    return this.http.get<T>(`${this.baseUrl}/${endpoint}/${id}`, {
      ...options,
      headers: { ...headers, ...(options?.headers || {}) },
    }) as Observable<T>;
  }

  create<T>(endpoint: string, data: any, options: Options = {}): Observable<T> {
    const headers = this.getAuthHeaders();
    return this.http.post<T>(`${this.baseUrl}/${endpoint}`, data, {
      ...options,
      headers: { ...headers, ...(options?.headers || {}) },
    });
  }

  update<T>(endpoint: string, data: any, options: Options = {}): Observable<T> {
    const headers = this.getAuthHeaders();
    return this.http.put<T>(`${this.baseUrl}/${endpoint}`, data, {
      ...options,
      headers: { ...headers, ...(options?.headers || {}) },
    });
  }

  delete<T>(
    endpoint: string,
    id: number | string,
    options: Options = {}
  ): Observable<T> {
    const headers = this.getAuthHeaders();
    return this.http.delete<T>(`${this.baseUrl}/${endpoint}/${id}`, {
      ...options,
      headers: { ...headers, ...(options?.headers || {}) },
    });
  }
}
