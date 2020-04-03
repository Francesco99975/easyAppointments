import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FavprofPageRoutingModule } from './favprof-routing.module';

import { FavprofPage } from './favprof.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FavprofPageRoutingModule
  ],
  declarations: [FavprofPage]
})
export class FavprofPageModule {}
