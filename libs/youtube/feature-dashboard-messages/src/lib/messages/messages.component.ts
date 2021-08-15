import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageActions } from '@streamkit/shared/actions';
import { Message } from '@streamkit/youtube/shared/models';

import { MessagesActions } from '@streamkit/youtube/shared/state/messages';

import * as DashboardMessagesPageSelectors from './messages.selectors';

@Component({
  selector: 'youtube-overlay-dashboard-messages',
  template: `
    <ion-header translucent>
      <ion-toolbar>
        <ion-title>Messages</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content *ngIf="vm$ | async as vm">
      <ion-list>
        <ion-item
          *ngFor="let message of vm.messages; trackBy: trackByFn"
          [color]="message.pinned ? 'primary' : undefined"
          button
          (click)="onTogglePinnedMessage(!message.pinned ? message.id : undefined)">
          <ion-avatar slot="start">
            <img src="{{ message.avatarUrl }}">
          </ion-avatar>

          <ion-label class="ion-text-wrap">
            <div [innerHTML]="message.formattedMessage"></div>
          </ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
  styles: [`
    :host {
      padding-top: 75px;
    }
  `]
})
export class MessagesComponent implements OnInit {
  vm$ = this.store.select(DashboardMessagesPageSelectors.selectMessagesViewModel);

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(MessagesActions.enterDashboardPage());
  }

  trackByFn(index: string, message: Message) {
    return message.id;
  }

  onTogglePinnedMessage(id?: string) {
    this.store.dispatch(MessageActions.messagePinned({id}));
  }

}
