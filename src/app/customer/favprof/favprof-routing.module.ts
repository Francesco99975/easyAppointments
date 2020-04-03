import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FavprofPage } from './favprof.page';

const routes: Routes = [
  {
    path: '',
    component: FavprofPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FavprofPageRoutingModule {}
