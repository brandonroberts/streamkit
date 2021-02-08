import { NgModule } from "@angular/core";
import { EffectsModule } from "@ngrx/effects";
import { StoreModule } from "@ngrx/store";

import { AlertsFeature, AlertsEffects } from './alerts';
import { AuthEffects } from "./auth";
import { WebSocketEffects } from "./websocket";

@NgModule({
  imports: [
    StoreModule.forFeature(AlertsFeature.alertsFeatureKey, AlertsFeature.reducer),
    EffectsModule.forFeature([AlertsEffects, WebSocketEffects, AuthEffects])
  ]
})
export class SharedStateModule {}