import { Route } from '@angular/router';
import { IdeasComponent } from 'app/modules/common/ideas/ideas.component';
import { IdeaListComponent } from 'app/modules/common/ideas/idea-list/idea-list.component';
import { DreamboardListComponent } from './dreamboard-list/dreamboard-list.component';
import { InspirationListComponent } from './inspiration-list/inspiration-list.component';
import { InspirationViewComponent } from './inspiration-view/inspiration-view.component';
import { MydreamComponent } from './mydream/mydream.component';

export const ideaRoutes: Route[] = [
  {
    path: '',
    component: IdeasComponent,
    children: [
      {
        path: '',
        component: IdeaListComponent
      },
      {
        path: 'idea-list/:id',
        component: DreamboardListComponent
      },
      {
        path: 'dreamboard/:id',
        component: InspirationListComponent,
      },
      {
        path: 'inspiration/:id',
        component: InspirationViewComponent
      },
      {
        path: 'my-dream',
        component: MydreamComponent
      },
      {
        path: 'local-dream',
        component: MydreamComponent
      },
    ]
  },
];
