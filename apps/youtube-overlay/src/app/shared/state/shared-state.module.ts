import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { WebSocketEffects } from './websocket';

@NgModule({
  imports: [
    EffectsModule.forFeature([WebSocketEffects]),
  ],
})
export class SharedStateModule {}
