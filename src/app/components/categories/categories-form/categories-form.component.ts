import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { ICategory } from '../../../interfaces/index';
import { CommonModule } from '@angular/common';

/**
 * Component for creating or updating a category.
 */
@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './categories-form.component.html',
  styleUrls: ['./categories-form.component.scss']
})
export class CategoryFormComponent {
  public fb: FormBuilder = inject(FormBuilder);
  @Input() categoryForm!: FormGroup;
  @Output() callSaveMethod: EventEmitter<ICategory> = new EventEmitter<ICategory>();
  @Output() callUpdateMethod: EventEmitter<ICategory> = new EventEmitter<ICategory>();

  /**
   * Emits a save or update event based on whether a category ID exists.
   */
  callSave() {
    let category: ICategory = {
      name: this.categoryForm.controls['name'].value,
      description: this.categoryForm.controls['description'].value
    };
    if (this.categoryForm.controls['id'].value) {
      category.id = this.categoryForm.controls['id'].value;
    }
    if (category.id) {
      this.callUpdateMethod.emit(category);
    } else {
      this.callSaveMethod.emit(category);
    }
  }
}
