import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { SharedStateModule } from './shared/state/shared-state.module';

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', redirectTo: '/alerts' },
      { path: 'alerts', loadChildren: () => import('@streamkit/youtube/feature-alerts').then(m => m.YoutubeFeatureAlertsModule) },
      { path: 'messages', loadChildren: () => import('@streamkit/youtube/feature-messages').then(m => m.YoutubeFeatureMessagesModule) },
      {
        path: 'broadcasts',
        loadChildren: () =>
          import('@streamkit/youtube/feature-broadcasts').then(
            (m) => m.YoutubeFeatureBroadcastsModule
          ),
      },
    ]),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot(),
    SharedStateModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
