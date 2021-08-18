import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { IonicModule } from '@ionic/angular';

import { YoutubeSharedStateMessagesModule } from '@streamkit/youtube/shared/state/messages';
import { YoutubeSharedStateWebsocketModule } from '@streamkit/youtube/shared/state/websocket';
import { YoutubeSharedStateSubscriptionsModule } from '@streamkit/youtube/shared/state/subscriptions';

import { YoutubeSharedEnvironmentModule } from '@streamkit/youtube/shared/environment';

import { AppComponent } from './app.component';
import { environment } from '../environments/environment';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: '/alerts' },
      {
        path: 'alerts',
        loadChildren: () =>
          import('@streamkit/youtube/feature-alerts').then(
            (m) => m.YoutubeFeatureAlertsModule
          ),
      },
      {
        path: 'messages',
        loadChildren: () =>
          import('@streamkit/youtube/feature-messages').then(
            (m) => m.YoutubeFeatureMessagesModule
          ),
      },
      {
        path: 'broadcasts',
        loadChildren: () =>
          import('@streamkit/youtube/feature-broadcasts').then(
            (m) => m.YoutubeFeatureBroadcastsModule
          ),
      },
      {
        path: 'dashboard',
        loadChildren: () =>
          import('@streamkit/youtube/feature-dashboard').then(
            (m) => m.YoutubeFeatureDashboardModule
          ),
      },      
    ]),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot(),
    YoutubeSharedEnvironmentModule.forRoot(environment),
    YoutubeSharedStateSubscriptionsModule,
    YoutubeSharedStateMessagesModule,
    YoutubeSharedStateWebsocketModule,
    IonicModule.forRoot()
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
