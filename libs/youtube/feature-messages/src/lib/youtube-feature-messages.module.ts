import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { IonicModule } from '@ionic/angular';

import { MessagesComponent } from './messages.component';
import { PinnedMessageComponent } from './pinned-message/pinned-message.component';

@NgModule({
  declarations: [MessagesComponent, PinnedMessageComponent],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      { path: 'pinned', component: PinnedMessageComponent },
      { path: '', component: MessagesComponent }
    ]),
  ],
})
export class YoutubeFeatureMessagesModule {}
