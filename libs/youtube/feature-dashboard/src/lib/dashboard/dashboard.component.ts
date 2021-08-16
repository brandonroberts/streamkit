import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { MessagesActions } from '@streamkit/youtube/shared/state/messages';

@Component({
  selector: 'youtube-overlay-dashboard',
  template: `
    <ion-toolbar color="tertiary">
      <ion-buttons slot="start">
        <ion-menu-button auto-hide="false"></ion-menu-button>
      </ion-buttons>

      <ion-title>StreamKit</ion-title>

      <ion-buttons slot="primary">
        <ion-button color="secondary" (click)="onStartPolling()">
          <ion-icon slot="icon-only" ios="play" md="play"></ion-icon>
        </ion-button>
        <ion-button color="secondary" (click)="onStopPolling()">
          <ion-icon slot="icon-only" ios="stop" md="stop"></ion-icon>
        </ion-button>
      </ion-buttons>
    </ion-toolbar>

    <ion-router-outlet></ion-router-outlet>
  `
})
export class DashboardComponent implements OnInit {

  constructor(private store: Store) { }

  ngOnInit(): void {
  }

  onStartPolling() {
    this.store.dispatch(MessagesActions.pollingStarted());
  }

  onStopPolling() {
    this.store.dispatch(MessagesActions.pollingStopped());
  }
}
