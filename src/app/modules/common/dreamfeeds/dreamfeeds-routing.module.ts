import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DreamfeedsComponent } from './dreamfeeds.component';

const routes: Routes = [
  {
    path: '',
    component: DreamfeedsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DreamfeedsRoutingModule { }
