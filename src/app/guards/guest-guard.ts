import { Injectable } from '@angular/core';

import { CanActivate } from '@angular/router';
import { AuthService } from '../services/auth.service.ts';

@Injectable({ providedIn: 'root' })
export class GuestGuard implements CanActivate {
  constructor(private auth: AuthService) {}

  canActivate(): boolean {
    return !this.auth.validateToken();
  }
}
