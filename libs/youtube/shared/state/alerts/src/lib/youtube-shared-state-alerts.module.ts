import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { GithubSharedStateAlertsModule } from '@streamkit/github/shared/state/alerts';

import * as AlertsFeature from './alerts.reducer';
import { AlertsEffects } from './alerts.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(
      AlertsFeature.alertsFeatureKey,
      AlertsFeature.reducer
    ),
    EffectsModule.forFeature([AlertsEffects]),
    GithubSharedStateAlertsModule
  ],
})
export class YoutubeSharedStateAlertsModule {}
