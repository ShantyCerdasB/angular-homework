import { inject, Injectable, signal } from '@angular/core';
import { BaseService } from './base-service';
import { ICategory, ISearch } from '../interfaces';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService extends BaseService<ICategory> {
  protected override source: string = 'api/categories';
  private categoryListSignal = signal<ICategory[]>([]);
  get categories$() {
    return this.categoryListSignal;
  }
  public search: ISearch = { 
    page: 1,
    size: 5
  };
  public totalItems: any = [];
  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);

  getAll() {
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        console.log('Categories fetched successfully:', response);
        this.search = { ...this.search, ...response.meta };
        this.totalItems = Array.from(
          { length: this.search.totalPages ? this.search.totalPages : 0 },
          (_, i) => i + 1
        );
        this.categoryListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('Error fetching categories', err);
      }
    });
  }

  save(category: ICategory) {
    this.add(category).subscribe({
      next: (response: any) => {
        console.log('Category saved successfully:', response);
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll(); 
      },
      error: (err: any) => {
        console.error('Error saving category', err);
        this.alertService.displayAlert('error', 'An error occurred adding the category', 'center', 'top', ['error-snackbar']);
      }
    });
  }

  update(category: ICategory) {
    this.editCustomSource(`${category.id}`, category).subscribe({
      next: (response: any) => {
        console.log('Category updated successfully:', response);
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll(); // Refresh list after update
      },
      error: (err: any) => {
        console.error('Error updating category', err);
        this.alertService.displayAlert('error', 'An error occurred updating the category', 'center', 'top', ['error-snackbar']);
      }
    });
  }

  delete(category: ICategory) {
    this.delCustomSource(`${category.id}`).subscribe({
      next: (response: any) => {
        console.log('Category deleted successfully:', response);
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll(); // Refresh list after deletion
      },
      error: (err: any) => {
        console.error('Error deleting category', err);
        this.alertService.displayAlert('error', 'An error occurred deleting the category', 'center', 'top', ['error-snackbar']);
      }
    });
  }
}
