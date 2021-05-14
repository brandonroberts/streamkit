import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { AlertsFeature, AlertsEffects, GithubAlertsEffects, GiphyAlertsEffects } from './alerts';
import { WebSocketEffects } from "./websocket";
import { MessagesFeature, MessagesEffects } from "./messages";

@NgModule({
  imports: [
    StoreModule.forFeature(AlertsFeature.alertsFeatureKey, AlertsFeature.reducer),
    StoreModule.forFeature(MessagesFeature.messagesFeatureKey, MessagesFeature.reducer),
    EffectsModule.forFeature([
      WebSocketEffects,
      AlertsEffects,
      GiphyAlertsEffects,
      GithubAlertsEffects,
      MessagesEffects
    ])
  ]
})
export class SharedStateModule {}