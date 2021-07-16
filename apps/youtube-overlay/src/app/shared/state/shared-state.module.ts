import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { AlertsFeature, AlertsEffects } from './alerts';
import { WebSocketEffects } from './websocket';
import { YouTubeEffects } from './youtube/youtube.effects';
import { SubscriptionsFeature } from './subscriptions';

@NgModule({
  imports: [
    StoreModule.forFeature(
      AlertsFeature.alertsFeatureKey,
      AlertsFeature.reducer
    ),

    EffectsModule.forFeature([
      AlertsEffects,
      WebSocketEffects,
      YouTubeEffects,
    ]),
    StoreModule.forFeature(
      SubscriptionsFeature.subscriptionsFeatureKey,
      SubscriptionsFeature.reducer
    ),
  ],
})
export class SharedStateModule {}
