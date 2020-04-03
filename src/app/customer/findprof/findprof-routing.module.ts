import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FindprofPage } from './findprof.page';

const routes: Routes = [
  {
    path: '',
    component: FindprofPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FindprofPageRoutingModule {}
