import { NgModule } from '@angular/core';
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
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FuseAutogrowModule } from '@fuse/directives/autogrow';
import { FuseCardModule } from '@fuse/components/card';
import { FuseMasonryModule } from '@fuse/components/masonry';
import { MatDividerModule } from '@angular/material/divider';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { SharedModule } from 'app/shared/shared.module';
import { IdeasComponent } from 'app/modules/common/ideas/ideas.component';
import { IdeaDetailsComponent } from 'app/modules/common/ideas/idea-details/idea-details.component';
import { IdeaListComponent } from 'app/modules/common/ideas/idea-list/idea-list.component';
import { ideaRoutes } from 'app/modules/common/ideas/ideas.routing';
import { ProfileKitModule } from '../../../shared/profile-kit/profile-kit.module';
import { InspirationListComponent } from './inspiration-list/inspiration-list.component';
import { InspirationDetailComponent } from './inspiration-detail/inspiration-detail.component';
import { DreamboardListComponent } from './dreamboard-list/dreamboard-list.component';
import { DreamboardDetailComponent } from './dreamboard-detail/dreamboard-detail.component';
import { InspirationViewComponent } from './inspiration-view/inspiration-view.component';
import { MydreamComponent } from './mydream/mydream.component';
import { IdeaRemoveComponent } from './idea-remove/idea-remove.component';
import { MatTreeModule } from '@angular/material/tree';
import { DreamSidebarComponent } from './dream-sidebar/dream-sidebar.component';
import { DreamSubfilterComponent } from './dream-subfilter/dream-subfilter.component';
import { AgmCoreModule } from '@agm/core';

@NgModule({
  declarations: [
    IdeasComponent,
    IdeaDetailsComponent,
    IdeaListComponent,
    InspirationListComponent,
    InspirationDetailComponent,
    DreamboardListComponent,
    DreamboardDetailComponent,
    InspirationViewComponent,
    MydreamComponent,
    DreamSidebarComponent,
    DreamSubfilterComponent,
    IdeaRemoveComponent
  ],
  imports: [
    RouterModule.forChild(ideaRoutes),
    MatButtonModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatRippleModule,
    MatSidenavModule,
    MatTableModule,
    FuseAutogrowModule,
    FuseMasonryModule,
    SharedModule,
    MatProgressSpinnerModule,
    ProfileKitModule,
    FuseCardModule,
    MatTreeModule,
    MatSnackBarModule,
    AgmCoreModule.forRoot({
      // apiKey: 'AIzaSyCVh1YJQZ1mLSeAwUabKT9bPS9CUOZQlzQ',
      apiKey: 'AIzaSyCltk36pRcRHPSTTykB8M434z0VDc-xBik',
      libraries: ['places']
    }),
  ],
  providers: [
    MatSnackBarModule,
  ]
})
export class IdeasModule {
}
