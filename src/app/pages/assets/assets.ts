import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { Asset } from '../../models/Asset.model';
import { ApiResponse } from '../../models/api.model';
import { Category } from '../../models/category.model';
import { Location } from '../../models/location.model';
import { CardModule } from 'primeng/card';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-assets',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    DialogModule,
    InputTextModule,
    ButtonModule,
    ConfirmDialogModule,
    ToastModule,
    InputNumberModule,
    AutoCompleteModule,
  ],
  templateUrl: './assets.html',
  styleUrls: ['./assets.scss'],
  providers: [ConfirmationService, MessageService],
})
export class AssetsComponent implements OnInit {
  assets: Asset[] = [];
  categories: Category[] = [];
  locations: Location[] = [];

  selectedAsset: Asset = this.initEmptyAsset();

  selectedCategory!: Category;
  selectedLocation!: Location;

  filteredCategories: Category[] = [];
  filteredLocations: Location[] = [];

  displayDialog = false;
  isEdit = false;

  searchQuery: string = '';
  filteredAssets: Asset[] = [];

  constructor(
    private api: Api,
    private confirm: ConfirmationService,
    private toast: MessageService
  ) {}

  ngOnInit() {
    this.loadAssets();
    this.loadCategories();
    this.loadLocations();
  }

  initEmptyAsset(): Asset {
    return {
      id: 0,
      name: '',
      code: '',
      description: '',
      purchaseDate: '',
      value: 0,
      categoryId: 0,
      locationId: 0,
    };
  }

  loadAssets() {
    this.api.getAll<any>('Asset/GetAllAssets').subscribe({
      next: (res) => {
        if (res.code === 1) {
          this.assets = res.obj;
          this.filteredAssets = res.obj;
        }
      },
      error: () =>
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load assets',
        }),
    });
  }

  filterAssets() {
    const query = this.searchQuery.toLowerCase();
    this.filteredAssets = this.assets.filter((asset) => {
      const categoryName = this.getCategoryName(asset.categoryId).toLowerCase();
      const locationName = this.getLocationName(asset.locationId).toLowerCase();
      return (
        asset.name.toLowerCase().includes(query) ||
        asset.code.toLowerCase().includes(query) ||
        asset.description.toLowerCase().includes(query) ||
        categoryName.includes(query) ||
        locationName.includes(query)
      );
    });
  }

  loadCategories() {
    this.api.getAll<any>('Category/GetAllCategories').subscribe({
      next: (res) => {
        if (res.code === 1) this.categories = res.obj;
      },
      error: () =>
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load categories',
        }),
    });
  }

  loadLocations() {
    this.api.getAll<any>('Location/GetAllLocations').subscribe({
      next: (res) => {
        if (res.code === 1) this.locations = res.obj;
      },
      error: () =>
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load locations',
        }),
    });
  }

  getCategoryName(categoryId: number): string {
    const category = this.categories.find((cat) => cat.id === categoryId);
    return category ? category.name : '-';
  }

  getLocationName(locationId: number): string {
    const location = this.locations.find((loc) => loc.id === locationId);
    return location ? location.name : '-';
  }

  openCreateDialog() {
    this.selectedAsset = this.initEmptyAsset();
    this.selectedCategory = {} as Category;
    this.selectedLocation = {} as Location;
    this.isEdit = false;
    this.displayDialog = true;
  }

  openEditDialog(asset: Asset) {
    this.selectedAsset = { ...asset };
    this.selectedCategory = this.categories.find(
      (c) => c.id === asset.categoryId
    )!;
    this.selectedLocation = this.locations.find(
      (l) => l.id === asset.locationId
    )!;
    this.isEdit = true;
    this.displayDialog = true;
  }

  saveAsset() {
    this.selectedAsset.categoryId = this.selectedCategory?.id;
    this.selectedAsset.locationId = this.selectedLocation?.id;

    const request = this.isEdit
      ? this.api.update('Asset/UpdateAsset', this.selectedAsset)
      : this.api.create('Asset/CreateAsset', this.selectedAsset);

    request.subscribe({
      next: () => {
        this.toast.add({
          severity: 'success',
          summary: this.isEdit ? 'Updated' : 'Created',
          detail: 'Asset saved',
        });
        this.displayDialog = false;
        this.loadAssets();
      },
      error: () => {
        this.toast.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to save asset',
        });
      },
    });
  }

  deleteAsset(asset: Asset) {
    this.confirm.confirm({
      message: `Are you sure you want to delete "${asset.name}"?`,
      accept: () => {
        this.api.delete('Asset/DeleteAsset', asset.id).subscribe({
          next: () => {
            this.toast.add({
              severity: 'info',
              summary: 'Deleted',
              detail: 'Asset deleted',
            });
            this.loadAssets();
          },
          error: () => {
            this.toast.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete asset',
            });
          },
        });
      },
    });
  }

  searchCategories(event: any) {
    const query = event.query.toLowerCase();
    this.filteredCategories = this.categories.filter((cat) =>
      cat.name.toLowerCase().includes(query)
    );
  }

  searchLocations(event: any) {
    const query = event.query.toLowerCase();
    this.filteredLocations = this.locations.filter((loc) =>
      loc.name.toLowerCase().includes(query)
    );
  }
}
