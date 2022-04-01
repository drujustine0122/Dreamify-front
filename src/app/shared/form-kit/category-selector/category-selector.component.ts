import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { map, startWith } from 'rxjs/operators';

import { Category } from '../../../core/category/category.model';
import { CategoryService } from '../../../core/category/category.service';

@Component({
  selector: 'app-category-selector',
  templateUrl: './category-selector.component.html',
  styleUrls: ['./category-selector.component.scss']
})
export class CategorySelectorComponent implements OnInit {

  @ViewChild('categoryInput') categoryInput: ElementRef<HTMLInputElement>;
  @ViewChild('categoryAutoComplete') matAutocomplete: MatAutocomplete;

  @Input() categories: Category[] = [];
  @Input() readonly;

  filteredCategories;
  categoryCtrl = new FormControl();

  constructor(
    private categoryService: CategoryService
  ) {
    this.filteredCategories = this.categoryCtrl.valueChanges.pipe(
      startWith(null),
      map((keyword: string | null) => keyword ? this.filterCategory(keyword) : this.categoryService.categories.slice()));
  }

  ngOnInit(): void {
    this.categories = this.categories || []; // make the categories object at least an empty array
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.categories.push({ id: event.option.value, name: event.option.viewValue });
    this.categoryInput.nativeElement.value = '';
  }

  remove(category: Category): void {
    const index = this.categories.findIndex(cat => cat.id === category.id);
    if (index >= 0) {
      this.categories.splice(index, 1);
    }
  }

  private filterCategory(value: string): Category[] {
    const filterValue = value.toLowerCase();
    return this.categoryService.categories.filter(category =>
      category.name.toLowerCase().indexOf(filterValue) === 0 &&
      !this.categories.find(existing => existing.name.toLowerCase().indexOf(filterValue) === 0)
    );
  }

}
