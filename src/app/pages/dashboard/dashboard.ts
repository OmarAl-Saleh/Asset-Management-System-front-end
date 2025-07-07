import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
// import { Api } from 'src/app/services/api.service'; // Adjust path if needed
import { Api } from '../../services/api';
import { AuthService } from '../../services/auth.service.ts';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, CardModule, ToastModule],
  templateUrl: './dashboard.html',
  providers: [MessageService],
})
export class DashboardComponent implements OnInit {
  dashboardData: any = {};
  userRole: string | null = null;
  constructor(
    private api: Api,
    private Auth: AuthService,
    private toast: MessageService
  ) {}

  ngOnInit(): void {
    this.userRole = this.getUserRole();
    this.loadDashboard();
  }

  loadDashboard() {
    this.api.getAll<any>('dashboard').subscribe({
      next: (res) => {
        if (res.code === 1) {
          this.dashboardData = res.obj;
        } else {
          this.toast.add({
            severity: 'warn',
            summary: 'Warning',
            detail: res.strMessage,
          });
        }
      },
      error: () => {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load dashboard',
        });
      },
    });
  }
  getUserRole(): string | null {
    return this.Auth.getUserRole();
  }
}
