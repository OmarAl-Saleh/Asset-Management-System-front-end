import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service.ts';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  providers: [MessageService],
  imports: [
    CommonModule,
    FormsModule,
    ToastModule,
    InputTextModule,
    ButtonModule,
  ],
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(
    private auth: AuthService,
    private router: Router,
    private toast: MessageService
  ) {}

  onLogin() {
    this.auth.login(this.username, this.password).subscribe({
      next: (res) => {
        if (!res.obj.user.isActive) {
          this.toast.add({
            severity: 'warn',
            summary: 'Inactive User',
            detail: 'User is not activated',
          });
          return;
        }

        this.auth.saveTokens(res.obj.accessToken, res.obj.refreshToken);
        this.auth.setUserRole(res.obj.user.role);
        this.router.navigate(['/dashboard']);
      },
      error: () => {
        this.toast.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'Invalid username or password',
        });
      },
    });
  }
}
