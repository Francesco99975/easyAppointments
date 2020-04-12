import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { ProfessionalPage } from "./professional.page";

const routes: Routes = [
  {
    path: "tabs",
    component: ProfessionalPage,
    children: [
      {
        path: "setup",
        loadChildren: () =>
          import("./setup/setup.module").then((m) => m.SetupPageModule),
      },
      {
        path: "requests",
        loadChildren: () =>
          import("./requests/requests.module").then(
            (m) => m.RequestsPageModule
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
export class ProfessionalPageRoutingModule {}
