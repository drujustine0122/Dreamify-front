import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatGoogleMapsAutocompleteModule } from '@angular-material-extensions/google-maps-autocomplete';
import { AgmCoreModule } from '@agm/core';
import { NgxMaskModule } from 'ngx-mask';
import { NgxUploaderModule } from 'ngx-uploader';

import { FuseCardModule } from '../../../@fuse/components/card';
import { FormKitModule } from '../form-kit/form-kit.module';

import { AboutFormComponent } from './about-form/about-form.component';
import { BasicProfileFormComponent } from './basic-profile-form/basic-profile-form.component';
import { CategoryFormComponent } from './category-form/category-form.component';
import { AvatarUploaderComponent } from './avatar-uploader/avatar-uploader.component';
import { BannerUploaderComponent } from './banner-uploader/banner-uploader.component';
import { CustomerProfileFormComponent } from './customer-profile-form/customer-profile-form.component';
import { FollowButtonComponent } from './follow-button/follow-button.component';

@NgModule({
  declarations: [
    AboutFormComponent,
    BasicProfileFormComponent,
    CategoryFormComponent,
    AvatarUploaderComponent,
    BannerUploaderComponent,
    CustomerProfileFormComponent,
    FollowButtonComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatInputModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgxMaskModule.forRoot(),
    NgxUploaderModule,
    MatGoogleMapsAutocompleteModule,
    FuseCardModule,
    FormKitModule,
    AgmCoreModule
  ],
  exports: [
    AboutFormComponent,
    BasicProfileFormComponent,
    CategoryFormComponent,
    AvatarUploaderComponent,
    BannerUploaderComponent,
    CustomerProfileFormComponent,
    FollowButtonComponent
  ]
})
export class ProfileKitModule { }
