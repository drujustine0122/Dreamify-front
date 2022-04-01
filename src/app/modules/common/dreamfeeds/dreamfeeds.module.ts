import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DreamfeedsRoutingModule } from './dreamfeeds-routing.module';
import { DreamfeedsComponent } from './dreamfeeds.component';
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
import { FuseCardModule } from '@fuse/components/card';
import { FuseMasonryModule } from '@fuse/components/masonry';
import { MatDividerModule } from '@angular/material/divider';
import { ProfileKitModule } from '../../../shared/profile-kit/profile-kit.module';
import { SharedModule } from 'app/shared/shared.module';
import { PipesModule } from 'app/shared/pipes/pipes.module';
import { StoryComponent } from './story/story.component';
import { InspirationComponent } from './inspiration/inspiration.component';
import { DreamComponent } from './dream/dream.component';
import { ArticleComponent } from './article/article.component';
import { CreateThreadComponent } from './create-thread/create-thread.component';
import { MessageBodyComponent } from './message-body/message-body.component';
import { MessageComponent } from './message/message.component';


@NgModule({
  declarations: [
    DreamfeedsComponent,
    StoryComponent,
    InspirationComponent,
    DreamComponent,
    ArticleComponent,
    MessageBodyComponent,
    CreateThreadComponent,
    MessageComponent,
  ],
  imports: [
    CommonModule,
    DreamfeedsRoutingModule,
    FuseCardModule,
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
    FuseAutogrowModule,
    FuseMasonryModule,
    SharedModule,
    MatProgressSpinnerModule,
    ProfileKitModule,
    FuseCardModule,
    PipesModule
  ]
})
export class DreamfeedsModule { }
