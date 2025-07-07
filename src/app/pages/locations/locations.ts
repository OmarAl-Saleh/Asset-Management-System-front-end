import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { ApiResponse } from '../../models/api.model';
import { Location } from '../../models/location.model';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-locations',
  standalone: true,
  templateUrl: './locations.html',
  styleUrls: ['./locations.scss'],
  imports: [
    CommonModule,
    CardModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    FormsModule,
  ],
  providers: [ConfirmationService, MessageService],
})
export class LocationsComponent implements OnInit {
  locations: Location[] = [];
  selectedLocation: Location = { id: 0, name: '', description: '' };
  displayDialog = false;
  isEdit = false;

  constructor(
    private api: Api,
    private confirm: ConfirmationService,
    private toast: MessageService
  ) {}

  ngOnInit() {
    this.loadLocations();
  }

  loadLocations() {
    this.api
      .getAll<ApiResponse<Location[]>>('Location/GetAllLocations')
      .subscribe({
        next: (res) => {
          if (res.code === 1) this.locations = res.obj;
        },
        error: () =>
          this.toast.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Could not load locations',
          }),
      });
  }

  openCreateDialog() {
    this.selectedLocation = { id: 0, name: '', description: '' };
    this.isEdit = false;
    this.displayDialog = true;
  }

  openEditDialog(loc: Location) {
    this.selectedLocation = { ...loc };
    this.isEdit = true;
    this.displayDialog = true;
  }

  saveLocation() {
    if (this.isEdit) {
      this.api
        .update('Location/UpdateLocation', this.selectedLocation)
        .subscribe(() => {
          this.toast.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Location updated',
          });
          this.displayDialog = false;
          this.loadLocations();
        });
    } else {
      this.api
        .create('Location/CreateLocation', this.selectedLocation)
        .subscribe(() => {
          this.toast.add({
            severity: 'success',
            summary: 'Created',
            detail: 'Location created',
          });
          this.displayDialog = false;
          this.loadLocations();
        });
    }
  }

  deleteLocation(loc: Location) {
    this.confirm.confirm({
      message: `Are you sure you want to delete ${loc.name}?`,
      accept: () => {
        this.api.delete('Location/DeleteLocation', loc.id).subscribe(() => {
          this.toast.add({
            severity: 'info',
            summary: 'Deleted',
            detail: 'Location deleted',
          });
          this.loadLocations();
        });
      },
    });
  }
}
