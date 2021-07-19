import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';

import { WebSocketEffects } from './websocket.effects';

@NgModule({
  imports: [
    EffectsModule.forFeature([WebSocketEffects]),
  ],
})
export class YoutubeSharedStateWebsocketModule {}
