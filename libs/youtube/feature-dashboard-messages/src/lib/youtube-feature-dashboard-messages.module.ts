import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

import { MessagesComponent } from './messages/messages.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    RouterModule.forChild([
      { path: '', component: MessagesComponent }
    ])
  ],
  declarations: [
    MessagesComponent
  ],
})
export class YoutubeFeatureDashboardMessagesModule {}
