import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { InspirationViewComponent } from './inspiration-view/inspiration-view.component';
import { InspirationsComponent } from './inspirations.component';

const routes: Routes = [{
  path: '',
  component: InspirationsComponent,
},
{
  path: ':id',
  component: InspirationViewComponent
}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InspirationsRoutingModule { }
