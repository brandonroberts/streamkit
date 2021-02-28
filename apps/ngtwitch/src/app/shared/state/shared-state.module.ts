import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { AlertsFeature, AlertsEffects } from './alerts';
import { AuthEffects } from "./auth";
import { WebSocketEffects } from "./websocket";
import { MessagesFeature, MessagesEffects } from "./messages";

@NgModule({
  imports: [
    StoreModule.forFeature(AlertsFeature.alertsFeatureKey, AlertsFeature.reducer),
    StoreModule.forFeature(MessagesFeature.messagesFeatureKey, MessagesFeature.reducer),
    EffectsModule.forFeature([AlertsEffects, WebSocketEffects, AuthEffects, MessagesEffects])
  ]
})
export class SharedStateModule {}