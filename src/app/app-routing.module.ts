import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./shared/auth.guard";

const routes: Routes = [
  { path: "", redirectTo: "home", pathMatch: "full" },
  {
    path: "home",
    loadChildren: () => import("./home/home.module").then(m => m.HomePageModule)
  },
  {
    path: "signup",
    loadChildren: () =>
      import("./signup/signup.module").then(m => m.SignupPageModule)
  },
  {
    path: "signin",
    loadChildren: () =>
      import("./signin/signin.module").then(m => m.SigninPageModule)
  },
  {
    path: "customer",
    loadChildren: () =>
      import("./customer/customer.module").then(m => m.CustomerPageModule),
    canActivate: [AuthGuard]
  },
  {
    path: "professional",
    loadChildren: () =>
      import("./professional/professional.module").then(
        m => m.ProfessionalPageModule
      ),
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {}
