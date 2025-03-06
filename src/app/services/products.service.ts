import { Injectable, inject, signal } from '@angular/core';
import { BaseService } from './base-service';
import { IProduct } from '../interfaces/index';
import { AuthService } from './auth.service';
import { AlertService } from './alert.service';
import { ISearch } from '../interfaces/index';

/**
 * Service for managing Product CRUD operations.
 * Uses BaseService for common HTTP operations.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService extends BaseService<IProduct> {
  // Define the source endpoint (e.g., your API URL will be baseUrl + 'products')
  protected override source: string = 'api/products';
  
  // Signal to hold the current list of products
  private productListSignal = signal<IProduct[]>([]);
  get products$() {
    return this.productListSignal;
  }
  
  public search: ISearch = { 
    page: 1,
    size: 5
  };
  public totalItems: any = [];
  
  private authService: AuthService = inject(AuthService);
  private alertService: AlertService = inject(AlertService);

  /**
   * Retrieves all products from the API.
   */
  getAll() {
    console.log('Fetching all products')
    this.findAllWithParams({ page: this.search.page, size: this.search.size }).subscribe({
      next: (response: any) => {
        console.log('Products fetched successfully:', response);
        // Merge the meta info (pagination) with our search settings.
        this.search = { ...this.search, ...response.meta };
        // Create an array for pagination buttons (if needed)
        this.totalItems = Array.from({ length: response.meta.totalPages ? response.meta.totalPages : 0 }, (_, i) => i + 1);
        // Update our signal with the fetched data.
        this.productListSignal.set(response.data);
      },
      error: (err: any) => {
        console.error('Error fetching products', err);
      }
    });
  }

/**
 * Saves a new product.
 * @param product The product data to add.
 */
save(product: IProduct) {
  // Transform product: replace categoryId with a category object.
  const productPayload = {
    ...product,
    category: { id: product.categoryId }
  };

  this.add(productPayload).subscribe({
    next: (response: any) => {
      console.log('Product saved successfully:', response);
      this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
      this.getAll();
    },
    error: (err: any) => {
      console.error('Error saving product', err);
      this.alertService.displayAlert('error', 'Error adding product', 'center', 'top', ['error-snackbar']);
    }
  });
}

/**
 * Updates an existing product.
 * @param product The product data to update.
 */
update(product: IProduct) {
  // Transform product: replace categoryId with a category object.
  const productPayload = {
    ...product,
    category: { id: product.categoryId }
  };

  this.edit(product.id, productPayload).subscribe({
    next: (response: any) => {
      console.log('Product updated successfully:', response);
      this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
      this.getAll();
    },
    error: (err: any) => {
      console.error('Error updating product', err);
      this.alertService.displayAlert('error', 'Error updating product', 'center', 'top', ['error-snackbar']);
    }
  });
}

  /**
   * Deletes a product.
   * @param product The product to delete.
   */
  delete(product: IProduct) {
    this.del(product.id).subscribe({
      next: (response: any) => {
        console.log('Product deleted successfully:', response);
        this.alertService.displayAlert('success', response.message, 'center', 'top', ['success-snackbar']);
        this.getAll();
      },
      error: (err: any) => {
        console.error('Error deleting product', err);
        this.alertService.displayAlert('error', 'Error deleting product', 'center', 'top', ['error-snackbar']);
      }
    });
  }
}
