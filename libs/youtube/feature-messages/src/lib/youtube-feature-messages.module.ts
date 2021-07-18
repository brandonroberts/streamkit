import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { YoutubeSharedStateMessagesModule } from '@streamkit/youtube/shared/state/messages';

import { MessagesComponent } from './messages.component';

@NgModule({
  declarations: [MessagesComponent],
  imports: [
    CommonModule,
    YoutubeSharedStateMessagesModule,
    RouterModule.forChild([{ path: '', component: MessagesComponent }]),
  ],
})
export class YoutubeFeatureMessagesModule {}
