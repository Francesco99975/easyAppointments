import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { SetupPageRoutingModule } from "./setup-routing.module";

import { SetupPage } from "./setup.page";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    SetupPageRoutingModule,
  ],
  declarations: [SetupPage],
})
export class SetupPageModule {}
