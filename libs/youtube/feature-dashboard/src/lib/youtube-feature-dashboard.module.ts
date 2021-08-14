import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      { path: '', component: DashboardComponent }
    ])
  ],
  declarations: [
    DashboardComponent
  ],
})
export class YoutubeFeatureDashboardModule {}
