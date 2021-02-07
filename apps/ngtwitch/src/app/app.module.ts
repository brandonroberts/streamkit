import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { AppComponent } from './app.component';
import { AlertsComponent } from './alerts/alerts.component';
import { HomePageComponent } from './features/home-page/home-page.component';
import { AuthComponent } from './features/auth/auth.component';
import { AuthCallbackComponent } from './features/auth-callback/auth-callback.component';
import { AppConfigInitializer } from './app-config.initializer';
import { WebSocketEffects } from './shared/state/websocket.effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

@NgModule({
  declarations: [
    AppComponent,
    AlertsComponent,
    HomePageComponent,
    AuthComponent,
    AuthCallbackComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    RouterModule.forRoot([
      { path: '', pathMatch: 'full', component: HomePageComponent },
      { path: 'auth', component: AuthComponent },
      { path: 'auth-callback', component: AuthCallbackComponent }
    ]),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot([WebSocketEffects])
  ],
  providers: [
    AppConfigInitializer
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
