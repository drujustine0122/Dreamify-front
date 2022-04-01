import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FuseCardModule } from '@fuse/components/card';
import { SharedModule } from 'app/shared/shared.module';
import { CompleteProfileComponent } from './complete-profile.component';
import { completeProfileRoutes } from './complete-profile.routing';
import { ProfileKitModule } from '../../../shared/profile-kit/profile-kit.module';

@NgModule({
  declarations: [
    CompleteProfileComponent
  ],
  imports: [
    RouterModule.forChild(completeProfileRoutes),
    MatButtonModule,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    FuseCardModule,
    SharedModule,
    ProfileKitModule
  ]
})
export class CompleteProfileModule {
}
