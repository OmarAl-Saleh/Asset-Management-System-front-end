import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service.ts';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, ButtonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  constructor(public auth: AuthService, private router: Router) {}

  logout() {
    this.auth.logout();
  }
}
