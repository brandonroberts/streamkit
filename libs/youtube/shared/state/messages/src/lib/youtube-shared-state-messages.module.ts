import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoreModule } from '@ngrx/store';

import * as MessagesFeature from './messages.reducer';

@NgModule({
  imports: [
    CommonModule,
    StoreModule.forFeature(
      MessagesFeature.messagesFeatureKey,
      MessagesFeature.reducer
    ),    
  ],
})
export class YoutubeSharedStateMessagesModule {}
