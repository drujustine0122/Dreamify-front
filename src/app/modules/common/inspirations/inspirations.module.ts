import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatRippleModule } from '@angular/material/core';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseAutogrowModule } from '@fuse/directives/autogrow';
import { FuseMasonryModule } from '@fuse/components/masonry';

import { SharedModule } from 'app/shared/shared.module';
import { ProfileKitModule } from '../../../shared/profile-kit/profile-kit.module';
import { InspirationsRoutingModule } from './inspirations-routing.module';
import { InspirationsComponent } from './inspirations.component';
import { InspirationDetailComponent } from './inspiration-detail/inspiration-detail.component';
import { InspirationViewComponent } from './inspiration-view/inspiration-view.component';


@NgModule({
  declarations: [
    InspirationsComponent,
    InspirationDetailComponent,
    InspirationViewComponent
  ],
  imports: [
    CommonModule,
    InspirationsRoutingModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatSidenavModule,
    FuseAutogrowModule,
    FuseMasonryModule,
    SharedModule,
    MatProgressSpinnerModule,
    ProfileKitModule
  ]
})
export class InspirationsModule { }
