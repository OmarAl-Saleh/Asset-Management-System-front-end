import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { User, CreateUserDto } from '../../models/user.model';
import { ApiResponse } from '../../models/api.model';
import { AuthService } from '../../services/auth.service.ts';

import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-users',
  standalone: true,
  templateUrl: './users.html',
  styleUrls: ['./users.scss'],
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  roles = ['Admin', 'User']; // adjust roles as needed
  filteredRoles: string[] = [];

  selectedUser: CreateUserDto = {
    username: null,
    password: null,
    role: null,
  };

  displayDialog = false;

  constructor(
    private api: Api,
    private auth: AuthService,
    private confirm: ConfirmationService,
    private toast: MessageService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  isAdmin(): boolean {
    const token = this.auth.getAccessToken();
    if (!token) return false;
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role === 'Admin';
    } catch {
      return false;
    }
  }

  filterRoles(event: any) {
    const query = event.query.toLowerCase();
    this.filteredRoles = this.roles.filter((role) =>
      role.toLowerCase().includes(query)
    );
  }

  loadUsers() {
    this.api.getAll<ApiResponse<User[]>>('User/GetAllUsers').subscribe({
      next: (res) => {
        if (res.code === 1) this.users = res.obj;
      },
      error: () =>
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users',
        }),
    });
  }

  toggleActivation(user: User) {
    this.api.create(`User/ActivateUser/${user.id}`, {}).subscribe({
      next: () => {
        this.toast.add({
          severity: 'success',
          summary: 'Status Changed',
          detail: `User is now ${user.isActive ? 'Inactive' : 'Active'}`,
        });
        this.loadUsers();
      },
      error: () => {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to change user status',
        });
      },
    });
  }

  openCreateDialog() {
    this.selectedUser = { username: null, password: null, role: null };
    this.displayDialog = true;
  }

  saveUser() {
    if (
      !this.selectedUser.username ||
      !this.selectedUser.password ||
      !this.selectedUser.role
    ) {
      this.toast.add({
        severity: 'warn',
        summary: 'Validation',
        detail: 'All fields are required',
      });
      return;
    }

    this.api.create('User/CreateUser', this.selectedUser).subscribe({
      next: () => {
        this.toast.add({
          severity: 'success',
          summary: 'Created',
          detail: 'User created successfully',
        });
        this.displayDialog = false;
        this.loadUsers();
      },
      error: () =>
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to create user',
        }),
    });
  }

  deleteUser(user: User) {
    this.confirm.confirm({
      message: `Are you sure you want to delete user "${user.username}"?`,
      accept: () => {
        this.api.delete('User/DeleteUser', user.id).subscribe({
          next: () => {
            this.toast.add({
              severity: 'info',
              summary: 'Deleted',
              detail: 'User deleted',
            });
            this.loadUsers();
          },
          error: () =>
            this.toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete user',
            }),
        });
      },
    });
  }
}
