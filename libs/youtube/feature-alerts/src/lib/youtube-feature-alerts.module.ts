import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { YoutubeSharedStateAlertsModule } from '@streamkit/youtube/shared/state/alerts';
import { YoutubeSharedStateSubscriptionsModule } from '@streamkit/youtube/shared/state/subscriptions';
import { YoutubeSharedStateMessagesModule } from '@streamkit/youtube/shared/state/messages';

import { AlertsPageComponent } from './alerts-page.component';
import { AlertsComponent } from './alerts.component';

@NgModule({
  declarations: [AlertsComponent, AlertsPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: AlertsPageComponent }]),
    YoutubeSharedStateAlertsModule,
    YoutubeSharedStateSubscriptionsModule,
    YoutubeSharedStateMessagesModule
  ],
})
export class YoutubeFeatureAlertsModule {}
