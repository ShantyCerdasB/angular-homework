import { Component, inject } from '@angular/core';
import { CategoryFormComponent } from '../../components/categories/categories-form/categories-form.component';
import { CategoryListComponent } from '../../components/categories/categories-list/categories-list.component';
import { CategoriesService } from '../../services/categories.service';
import { AuthService } from '../../services/auth.service';
import { FormBuilder, Validators } from '@angular/forms';
import { ICategory } from '../../interfaces/index';
import { CommonModule } from '@angular/common';
import { PaginationComponent } from "../../components/pagination/pagination.component";

/**
 * Component for managing Categories.
 * Displays a category form (always visible) and a list of categories below.
 */
@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    CommonModule,
    CategoryListComponent,
    CategoryFormComponent,
    PaginationComponent
],
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent {
  public categoryService: CategoriesService = inject(CategoriesService);
  public authService: AuthService = inject(AuthService);
  public fb: FormBuilder = inject(FormBuilder);

  // Reactive form for creating/updating a category
  categoryForm = this.fb.group({
    id: [''],
    name: ['', Validators.required],
    description: ['', Validators.required]
  });

  constructor() {
    this.categoryService.search.page = 1;
    this.categoryService.getAll();
  }

  /**
   * Saves a new category.
   * @param category The category data to save.
   */
  saveCategory(category: ICategory) {
    this.categoryService.save(category);
  }

  /**
   * Loads the data of a category into the form for editing.
   * @param category The category data to edit.
   */
  callEdition(category: ICategory) {
    this.categoryForm.controls['id'].setValue(category.id ? category.id.toString() : '');
    this.categoryForm.controls['name'].setValue(category.name || '');
    this.categoryForm.controls['description'].setValue(category.description || '');
  }

  /**
   * Updates an existing category.
   * @param category The category data to update.
   */
  updateCategory(category: ICategory) {
    this.categoryService.update(category);
  }
}
