import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { WebSocketEffects } from './websocket';
import { SubscriptionsFeature } from './subscriptions';

@NgModule({
  imports: [
    EffectsModule.forFeature([WebSocketEffects]),
    StoreModule.forFeature(
      SubscriptionsFeature.subscriptionsFeatureKey,
      SubscriptionsFeature.reducer
    ),
  ],
})
export class SharedStateModule {}
