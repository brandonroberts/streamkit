import { Component, OnInit } from '@angular/core';

import { BroadcastsStore } from './broadcasts.store';

@Component({
  selector: 'youtube-overlay-broadcasts',
  template: `
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Broadcasts</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item *ngFor="let broadcast of broadcasts$ | async">
          <ion-label class="ion-text-wrap">
            <a
              [routerLink]="['/dashboard', 'messages']"
              [queryParams]="{ liveChatId: broadcast.snippet.liveChatId }"
              >{{ broadcast.snippet.title }}</a
            >
          </ion-label>

          <ion-buttons slot="end">
            <ion-button
              color="secondary"
              (click)="onStartPolling(broadcast.snippet.liveChatId)"
            >
              <ion-icon
                slot="icon-only"
                ios="infinite"
                md="infinite"
              ></ion-icon>
            </ion-button>
            <ion-button color="secondary" (click)="onStopPolling()">
              <ion-icon slot="icon-only" ios="stop" md="stop"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [
    `
      :host {
        padding-top: 75px;
      }
    `,
  ],
  providers: [BroadcastsStore],
})
export class BroadcastsComponent implements OnInit {
  broadcasts$ = this.broadcastsStore.broadcasts$;

  constructor(private broadcastsStore: BroadcastsStore) {}

  ngOnInit(): void {
    this.broadcastsStore.getBroadcasts();
  }

  onStartPolling(liveChatId: string) {
    this.broadcastsStore.startPolling(liveChatId);
  }

  onStopPolling() {
    this.broadcastsStore.stopPolling();
  }
}
