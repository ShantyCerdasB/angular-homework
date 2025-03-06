import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IProduct } from '../../../interfaces/index';
import { CommonModule } from '@angular/common';

/**
 * Component that displays a list of products.
 * It conditionally shows edit and delete buttons if the user is a SUPER-ADMIN.
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent {
  @Input() title: string = '';
  @Input() products: IProduct[] = [];
  // Flag indicating if the current user is SUPER-ADMIN.
  @Input() isSuperAdmin: boolean = false;
  @Output() callModalAction: EventEmitter<IProduct> = new EventEmitter<IProduct>();
  @Output() callDeleteAction: EventEmitter<IProduct> = new EventEmitter<IProduct>();
}
