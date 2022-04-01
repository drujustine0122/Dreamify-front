import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from 'app/shared/shared.module';
import { LandingHomeComponent } from 'app/modules/landing/home/home.component';
import { landingHomeRoutes } from 'app/modules/landing/home/home.routing';
import { FuseCardModule } from '../../../../@fuse/components/card';

@NgModule({
  declarations: [
    LandingHomeComponent
  ],
  imports: [
    RouterModule.forChild(landingHomeRoutes),
    MatButtonModule,
    MatIconModule,
    SharedModule,
    FuseCardModule
  ]
})
export class LandingHomeModule {
}
