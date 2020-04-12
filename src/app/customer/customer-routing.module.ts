import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { CustomerPage } from "./customer.page";

const routes: Routes = [
  {
    path: "tabs",
    component: CustomerPage,
    children: [
      {
        path: "findprof",
        loadChildren: () =>
          import("./findprof/findprof.module").then(
            (m) => m.FindprofPageModule
          ),
      },
      {
        path: "favprof",
        loadChildren: () =>
          import("./favprof/favprof.module").then((m) => m.FavprofPageModule),
      },
      {
        path: "schedule",
        loadChildren: () =>
          import("./schedule/schedule.module").then(
            (m) => m.SchedulePageModule
          ),
      },
      {
        path: "profile",
        loadChildren: () =>
          import("./profile/profile.module").then((m) => m.ProfilePageModule),
      },
    ],
  },
  {
    path: "",
    redirectTo: "tabs/profile",
    pathMatch: "full",
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CustomerPageRoutingModule {}
