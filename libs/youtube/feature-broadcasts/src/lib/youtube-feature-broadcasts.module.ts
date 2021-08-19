import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { BroadcastsComponent } from './broadcasts.component';

const routes: Routes = [{ path: '', component: BroadcastsComponent }];

@NgModule({
  declarations: [BroadcastsComponent],
  imports: [CommonModule, IonicModule, RouterModule.forChild(routes)],
})
export class YoutubeFeatureBroadcastsModule {}
