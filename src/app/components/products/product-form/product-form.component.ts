import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { IProduct } from '../../../interfaces/index';
import { CommonModule } from '@angular/common';

/**
 * Component for creating or updating a product.
 */
@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrls: ['./product-form.component.scss']
})
export class ProductFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  @Input() productForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();
  @Output() callUpdateMethod: EventEmitter<IProduct> = new EventEmitter<IProduct>();

  /**
   * Emits a save or update event based on whether a product ID exists.
   */
  callSave() {
    let product: IProduct = {
      name: this.productForm.controls['name'].value,
      description: this.productForm.controls['description'].value,
      price: this.productForm.controls['price'].value,
      stockQuantity: this.productForm.controls['stockQuantity'].value,
      categoryId: this.productForm.controls['categoryId'].value,
    };
    if (this.productForm.controls['id'].value) {
      product.id = this.productForm.controls['id'].value;
    }
    if (product.id) {
      this.callUpdateMethod.emit(product);
    } else {
      this.callSaveMethod.emit(product);
    }
  }
}
