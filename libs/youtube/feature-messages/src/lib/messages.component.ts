import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs/operators';

import { MessageService } from '@streamkit/youtube/data-access-messages';

import {
  MessagesActions,
  MessagesSelectors,
} from '@streamkit/youtube/shared/state/messages';
import { Message } from '@streamkit/youtube/shared/models';

@Component({
  selector: 'youtube-overlay-messages',
  template: `
    <div *ngIf="pinnedMessage$ | async as pinnedMessage">
      <div>
        <span [style.color]="pinnedMessage.userColor">{{
          pinnedMessage.user
        }}</span
        >:
        <span [innerHTML]="pinnedMessage.formattedMessage"></span>
        <button *ngIf="debug$ | async" (click)="pinMessage()">
          Unpin Message
        </button>
      </div>
    </div>

    <ul>
      <li
        [@messageAnimation]="'in'"
        class="message"
        *ngFor="let message of messages$ | async; trackBy: trackByFn"
      >
        <div class="content">
          <img
            class="avatar"
            *ngIf="message.avatarUrl"
            src="{{ message.avatarUrl }}"
          />
          <div
            class="user"
            [style.color]="message.userColor"
            [innerHTML]="message.formattedMessage"
          ></div>
          <button *ngIf="debug$ | async" (click)="pinMessage(message.id)">
            Pin Message
          </button>
        </div>
      </li>
    </ul>
  `,
  styles: [
    `
      ul {
        width: 100%;
        height: 98%;
        overflow: hidden;
        padding: 0;
        word-break: break-word;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
        background: transparent;
      }

      .message {
        display: flex;
        flex-direction: row;
        padding: 8px;
      }

      span.user {
        white-space: nowrap;
      }

      .user {
        padding-bottom: 4px;
        color: white;
      }

      .content {
        display: flex;
      }

      .avatar {
        width: 24px;
        height: 24px;
      }

      img {
        padding-right: 4px;
      }
    `,
  ],
  animations: [
    trigger('messageAnimation', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(300),
      ]),
      transition('* => void', [
        animate(200, style({ transform: 'translateX(-100%)' })),
      ]),
    ]),
  ],
})
export class MessagesComponent implements OnInit {
  pinnedMessage$ = this.store.select(MessagesSelectors.selectPinnedMessage);
  messages$ = this.store.select(MessagesSelectors.selectAllFormattedMessages);
  debug$ = this.route.queryParamMap.pipe(
    map((queryParams) => queryParams.get('debug'))
  );

  constructor(
    private store: Store,
    private messageService: MessageService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.store.dispatch(MessagesActions.enter());
  }

  pinMessage(id?: string) {
    this.messageService.pinMessage(id).subscribe();
    // this.pinnedMessage = message;
  }

  trackByFn(index: string, message: Message) {
    return message.id;
  }
}
