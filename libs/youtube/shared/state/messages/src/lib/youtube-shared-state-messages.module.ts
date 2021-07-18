import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';

import * as MessagesFeature from './messages.reducer';

@NgModule({
  imports: [
    StoreModule.forFeature(
      MessagesFeature.messagesFeatureKey,
      MessagesFeature.reducer
    ),
  ],
})
export class YoutubeSharedStateMessagesModule {}
