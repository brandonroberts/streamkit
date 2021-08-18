import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { YoutubeSharedStateMessagesModule } from '@streamkit/youtube/shared/state/messages';

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
          { path: '', pathMatch: 'full', redirectTo: 'messages' },
          { path: 'messages', loadChildren: () => import('@streamkit/youtube/feature-dashboard-messages').then(m => m.YoutubeFeatureDashboardMessagesModule) }
        ]
      }
    ])
  ],
  declarations: [
    DashboardComponent
  ],
})
export class YoutubeFeatureDashboardModule {}
