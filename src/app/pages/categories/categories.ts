import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Api } from '../../services/api';
import { Category } from '../../models/category.model';
import { ApiResponse } from '../../models/api.model';
import { FormsModule } from '@angular/forms';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';

@Component({
  standalone: true,
  selector: 'app-categories',
  templateUrl: './categories.html',
  styleUrls: ['./categories.scss'],
  imports: [
    CommonModule,
    FormsModule,
    CardModule,
    DialogModule,
    ButtonModule,
    InputTextModule,
    ConfirmDialogModule,
    ToastModule,
  ],
  providers: [ConfirmationService, MessageService],
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  selectedCategory: Category = { id: 0, name: '', description: '' };
  displayDialog = false;
  isEdit = false;

  constructor(
    private api: Api,
    private confirmService: ConfirmationService,
    private toast: MessageService
  ) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    this.api
      .getAll<ApiResponse<Category[]>>('Category/GetAllCategories')
      .subscribe({
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

  openCreateDialog() {
    this.selectedCategory = { id: 0, name: '', description: '' };
    this.isEdit = false;
    this.displayDialog = true;
  }

  openEditDialog(cat: Category) {
    this.selectedCategory = { ...cat };
    this.isEdit = true;
    this.displayDialog = true;
  }

  saveCategory() {
    if (this.isEdit) {
      this.api
        .update('Category/UpdateCategory', this.selectedCategory)
        .subscribe(() => {
          this.toast.add({
            severity: 'success',
            summary: 'Updated',
            detail: 'Category updated',
          });
          this.displayDialog = false;
          this.loadCategories();
        });
    } else {
      this.api
        .create('Category/CreateCategory', this.selectedCategory)
        .subscribe(() => {
          this.toast.add({
            severity: 'success',
            summary: 'Created',
            detail: 'Category created',
          });
          this.displayDialog = false;
          this.loadCategories();
        });
    }
  }

  deleteCategory(cat: Category) {
    this.confirmService.confirm({
      message: `Are you sure you want to delete ${cat.name}?`,
      accept: () => {
        this.api.delete('Category/DeleteCategory', cat.id).subscribe(() => {
          this.toast.add({
            severity: 'info',
            summary: 'Deleted',
            detail: 'Category deleted',
          });
          this.loadCategories();
        });
      },
    });
  }
}
