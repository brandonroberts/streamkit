import { NgModule } from '@angular/core';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';

import * as MessagesFeature from './messages.reducer';
import { MessagesEffects } from './messages.effects';

@NgModule({
  imports: [
    StoreModule.forFeature(
      MessagesFeature.messagesFeatureKey,
      MessagesFeature.reducer
    ),
    EffectsModule.forFeature([
      MessagesEffects
    ])
  ],
})
export class YoutubeSharedStateMessagesModule {}
