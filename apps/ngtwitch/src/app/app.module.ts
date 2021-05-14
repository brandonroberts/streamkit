import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { AlertsComponent } from './alerts/alerts.component';
import { HomePageComponent } from './features/home-page/home-page.component';
import { AuthComponent } from './features/auth/auth.component';
import { AuthCallbackComponent } from './features/auth-callback/auth-callback.component';
import { AppConfigInitializer } from './app-config.initializer';
import { SharedStateModule } from './shared/state/shared-state.module';
import { MessagesComponent } from './features/messages/messages.component';

@NgModule({
  declarations: [
    AppComponent,
    AlertsComponent,
    HomePageComponent,
    AuthComponent,
    AuthCallbackComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    RouterModule.forRoot([
    { path: '', pathMatch: 'full', component: HomePageComponent },
    { path: 'auth', component: AuthComponent },
    { path: 'auth-callback', component: AuthCallbackComponent },
    { path: 'messages', component: MessagesComponent }
], { relativeLinkResolution: 'legacy' }),
    StoreModule.forRoot({}),
    StoreDevtoolsModule.instrument(),
    EffectsModule.forRoot(),
    SharedStateModule
  ],
  providers: [
    AppConfigInitializer
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
