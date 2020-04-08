import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { FindprofPageRoutingModule } from "./findprof-routing.module";

import { FindprofPage } from "./findprof.page";

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonicModule,
    FindprofPageRoutingModule,
  ],
  declarations: [FindprofPage],
})
export class FindprofPageModule {}
