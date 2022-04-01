import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Gender, User } from '../../../core/user/user.model';
import { UserService } from '../../../core/user/user.service';
import { EnumUtil } from '../../../core/utils/enum.util';

@Component({
  selector: 'app-basic-profile-form',
  templateUrl: './basic-profile-form.component.html',
  styleUrls: ['./basic-profile-form.component.scss']
})
export class BasicProfileFormComponent implements OnInit, OnDestroy {

  @Input() mine: boolean;
  @Input() user: User;
  @Input() editable: boolean;
  @Input() editing: boolean;

  form: FormGroup;
  genderOptions = EnumUtil.enumToOptions<Gender>(Gender);

  private unsubscribeAll: Subject<any> = new Subject<any>();

  constructor(
    private userService: UserService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
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

  async save() {
    if (this.form.invalid) {
      return;
    }
    try {
      this.form.disable();
      await this.userService.update(this.form.value).toPromise();
      this.editing = false;
    } catch (e) {
      console.log(e);
    } finally {
      this.form.enable();
    }
  }

  private initForm(): void {
    const user = this.user || {} as User;
    this.form = this.fb.group({
      firstName: [user.firstName || '', Validators.required],
      lastName: [user.lastName || '', Validators.required],
      email: [user.email || '', [Validators.required, Validators.email]],
      phone: [user.phone || '', Validators.required],
      gender: [user.gender || '', Validators.required],
      birthday: [user.birthday || new Date('1980/1/1'), Validators.required],
    });
  }

}
