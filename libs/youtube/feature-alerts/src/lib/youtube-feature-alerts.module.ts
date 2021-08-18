import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { YoutubeSharedStateAlertsModule } from '@streamkit/youtube/shared/state/alerts';

import { AlertsPageComponent } from './alerts-page.component';
import { AlertsComponent } from './alerts.component';

@NgModule({
  declarations: [AlertsComponent, AlertsPageComponent],
  imports: [
    CommonModule,
    RouterModule.forChild([{ path: '', component: AlertsPageComponent }]),
    YoutubeSharedStateAlertsModule,
  ],
})
export class YoutubeFeatureAlertsModule {}
