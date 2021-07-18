import { NgModule } from '@angular/core';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import * as AlertsFeature from './alerts.reducer';
import { AlertsEffects } from './alerts.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(
      AlertsFeature.alertsFeatureKey,
      AlertsFeature.reducer
    ),
    EffectsModule.forFeature([AlertsEffects]),
  ],
})
export class YoutubeSharedStateAlertsModule {}
