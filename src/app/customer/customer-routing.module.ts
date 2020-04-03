import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CustomerPage } from './customer.page';

const routes: Routes = [
  {
    path: '',
    component: CustomerPage
  },
  {
    path: 'findprof',
    loadChildren: () => import('./findprof/findprof.module').then( m => m.FindprofPageModule)
  },
  {
    path: 'favprof',
    loadChildren: () => import('./favprof/favprof.module').then( m => m.FavprofPageModule)
  },
  {
    path: 'schedule',
    loadChildren: () => import('./schedule/schedule.module').then( m => m.SchedulePageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerPageRoutingModule {}
