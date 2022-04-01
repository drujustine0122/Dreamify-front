import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Location } from '@angular-material-extensions/google-maps-autocomplete';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { UserService } from '../../../core/user/user.service';
import { User } from '../../../core/user/user.model';
import { CustomerService } from '../../../core/customer/customer.service';
import { CategoryService } from '../../../core/category/category.service';
import { CustomerProfile } from '../../../core/customer/customer.model';
import PlaceResult = google.maps.places.PlaceResult;

@Component({
  selector: 'app-customer-profile-form',
  templateUrl: './customer-profile-form.component.html',
  styleUrls: ['./customer-profile-form.component.scss']
})
export class CustomerProfileFormComponent implements OnInit, OnDestroy {

  @Input() mine: boolean;
  @Input() user: User;
  @Input() editable: boolean;
  @Input() editing: boolean;

  isSaving = false;
  form: FormGroup;

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private userService: UserService,
    private customerService: CustomerService,
    private categoryService: CategoryService,
    private fb: FormBuilder
  ) {
  }

  ngOnInit(): void {
    this.categoryService.getCategories({type: 'Dream'});
    if (this.mine) {
      this.userService.user$.pipe(takeUntil(this.unsubscribeAll)).subscribe((user) => {
        this.user = user;
        this.initForm();
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

  onAutocompleteSelected(result: PlaceResult) {
    this.form.get('address').setValue(result.formatted_address);
  }

  onLocationSelected(location: Location) {
    this.form.get('latitude').setValue(location.latitude);
    this.form.get('longitude').setValue(location.longitude);
  }

  async save() {
    try {
      this.isSaving = true;
      await this.customerService.updateProfilePreference(this.form.value).toPromise();
      this.editing = false;
    } catch (e) {
      console.log(e);
    } finally {
      this.isSaving = false;
    }
  }

  private initForm(): void {
    let customerProfile;
    if (this.user) {
      customerProfile = this.user.customerProfile || {} as CustomerProfile;
    } else {
      customerProfile = {};
    }
    this.form = this.fb.group({
      title: [customerProfile.title],
      address: [customerProfile.address],
      latitude: [customerProfile.latitude],
      longitude: [customerProfile.longitude],
    });
  }
}
