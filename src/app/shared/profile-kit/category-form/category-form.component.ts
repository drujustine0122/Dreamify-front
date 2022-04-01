import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User } from '../../../core/user/user.model';
import { UserService } from '../../../core/user/user.service';
import { CustomerService } from '../../../core/customer/customer.service';
import { CategoryService } from '../../../core/category/category.service';

@Component({
  selector: 'app-category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss']
})
export class CategoryFormComponent implements OnInit, OnDestroy {

  @Input() mine: boolean;
  @Input() user: User;
  @Input() editable: boolean;
  @Input() editing: boolean;

  isSaving = false;

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private userService: UserService,
    private customerService: CustomerService,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.categoryService.getCategories({type: 'Dream'});
    if (this.mine) {
      this.userService.user$.pipe(takeUntil(this.unsubscribeAll)).subscribe((user) => {
        this.user = user;
      });
    }
  }

  ngOnDestroy() {
    this.unsubscribeAll.next();
    this.unsubscribeAll.complete();
  }

  startEditing() {
    this.editing = true;
  }

  async save() {
    try {
      this.isSaving = true;
      const ids = this.user.customerProfile.categories.map(x => x.id);
      await this.customerService.updateCategoryPreference(ids).toPromise();
      this.editing = false;
    } catch (e) {
      console.log(e);
    } finally {
      this.isSaving = false;
    }
  }

}
