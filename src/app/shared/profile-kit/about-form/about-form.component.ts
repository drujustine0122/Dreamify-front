import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { User, UserRole } from '../../../core/user/user.model';
import { UserService } from '../../../core/user/user.service';
import { CustomerService } from '../../../core/customer/customer.service';

@Component({
  selector: 'app-about-form',
  templateUrl: './about-form.component.html',
  styleUrls: ['./about-form.component.scss']
})
export class AboutFormComponent implements OnInit, OnDestroy {

  @Input() mine: boolean;
  @Input() user: User;
  @Input() editable: boolean;
  @Input() editing: boolean;

  isSaving = false;

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private userService: UserService,
    private customerService: CustomerService
  ) { }

  ngOnInit(): void {
    if (this.mine) {
      this.userService.user$.pipe(takeUntil(this.unsubscribeAll)).subscribe(user => this.user = user);
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
    if (this.mine && (this.user.role === UserRole.customer || this.user.role === UserRole.merchant)) {
      await this.updateCustomerProfilePreference();
    }
    this.editing = false;
    // TODO: implement different cases
  }

  private async updateCustomerProfilePreference() {
    try {
      this.isSaving = true;
      await this.customerService.updateProfilePreference({ bio: this.user.customerProfile.bio }).toPromise();
    } catch (e) {
      console.log(e);
    } finally {
      this.isSaving = false;
    }
  }

}
