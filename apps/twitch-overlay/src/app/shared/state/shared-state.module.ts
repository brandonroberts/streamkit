import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import { GithubSharedStateAlertsModule } from '@streamkit/github/shared/state/alerts';

import {
  AlertsFeature,
  AlertsEffects,
  GiphyAlertsEffects,
} from './alerts';
import { WebSocketEffects } from './websocket';
import { MessagesFeature, MessagesEffects } from './messages';

@NgModule({
  imports: [
    StoreModule.forFeature(AlertsFeature.alertsFeature),
    StoreModule.forFeature(
      MessagesFeature.messagesFeatureKey,
      MessagesFeature.reducer
    ),
    EffectsModule.forFeature([
      WebSocketEffects,
      AlertsEffects,
      GiphyAlertsEffects,
      MessagesEffects,
    ]),
    GithubSharedStateAlertsModule
  ],
})
export class SharedStateModule {}
