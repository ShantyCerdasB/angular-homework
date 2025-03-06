import { Component, inject, ViewChild } from '@angular/core';
import { ProductListComponent } from '../../components/products/product-list/product-list.component';
import { ModalComponent } from '../../components/modal/modal.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ProductFormComponent } from '../../components/products/product-form/product-form.component';
import { IProduct } from '../../interfaces/index';
import { FormBuilder, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ProductService } from '../../services/products.service';
import { CommonModule } from '@angular/common';
import { ModalService } from '../../services/modal.service';
import { PaginationComponent } from "../../components/pagination/pagination.component";

/**
 * Component for managing Products.
 * Displays the list of products and uses a modal with a form to create or update products.
 */
@Component({
  selector: 'app-products',
  standalone: true,
  imports: [
    CommonModule,
    ProductListComponent,
    ModalComponent,
    LoaderComponent,
    ProductFormComponent,
    PaginationComponent
],
  templateUrl: './product.component.html',
  styleUrls: ['./product.component.scss']
})
export class ProductComponent {
  public productService: ProductService = inject(ProductService);
  public modalService: ModalService = inject(ModalService);
  public authService: AuthService = inject(AuthService);
  @ViewChild('addProductModal') public addProductModal: any;
  public fb: FormBuilder = inject(FormBuilder);

  // Reactive form for product creation/updating with new fields.
  productForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required],
    price: [0, [Validators.required, Validators.min(1)]],
    stockQuantity: [0, [Validators.required, Validators.min(0)]],
    categoryId: [0, Validators.required]  
  });
  
  constructor() {
    this.productService.search.page = 1;
    // Fetch the product list when the component is initialized.
    this.productService.getAll();
  }

  /**
   * Saves a new product.
   * @param product The product data to save.
   */
  saveProduct(product: IProduct) {
    this.productService.save(product);
    this.modalService.closeAll();
  }

  /**
   * Opens the modal for editing a product.
   * @param product The product data to edit.
   */
  callEdition(product: IProduct) {
    // Set form controls, converting id to string if necessary.
    this.productForm.controls['id'].setValue(product.id ? product.id.toString() : '');
    this.productForm.controls['name'].setValue(product.name || '');
    this.productForm.controls['description'].setValue(product.description || '');
    this.productForm.controls['price'].setValue(product.price);
    this.productForm.controls['stockQuantity'].setValue(product.stockQuantity);
    this.productForm.controls['categoryId'].setValue(product.categoryId);
    this.modalService.displayModal('md', this.addProductModal);
  }

  /**
   * Updates an existing product.
   * @param product The product data to update.
   */
  updateProduct(product: IProduct) {
    this.productService.update(product);
    this.modalService.closeAll();
  }
}
