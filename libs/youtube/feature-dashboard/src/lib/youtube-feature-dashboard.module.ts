import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { DashboardComponent } from './dashboard/dashboard.component';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: DashboardComponent,
        children: [
          { path: '', pathMatch: 'full', redirectTo: 'broadcasts' },
          { path: 'messages', loadChildren: () => import('@streamkit/youtube/feature-dashboard-messages').then(m => m.YoutubeFeatureDashboardMessagesModule) },
          { path: 'broadcasts', loadChildren: () => import('@streamkit/youtube/feature-broadcasts').then(m => m.YoutubeFeatureBroadcastsModule) },
        ]
      }
    ])
  ],
  declarations: [
    DashboardComponent
  ],
})
export class YoutubeFeatureDashboardModule {}
