import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ICategory } from '../../../interfaces/index';
import { CommonModule } from '@angular/common';

/**
 * Component that displays a list of categories.
 * It conditionally shows edit and delete buttons if the user is SUPER-ADMIN.
 */
@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './categories-list.component.html',
  styleUrls: ['./categories-list.component.scss']
})
export class CategoryListComponent {
  @Input() title: string = '';
  @Input() categories: ICategory[] = [];
  @Input() isSuperAdmin: boolean = false;
  @Output() callModalAction: EventEmitter<ICategory> = new EventEmitter<ICategory>();
  @Output() callDeleteAction: EventEmitter<ICategory> = new EventEmitter<ICategory>();
}
