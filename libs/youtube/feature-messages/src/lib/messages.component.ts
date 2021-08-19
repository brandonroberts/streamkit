import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import {
  MessagesActions,
  MessagesSelectors,
} from '@streamkit/youtube/shared/state/messages';
import { Message } from '@streamkit/youtube/shared/models';

@Component({
  selector: 'youtube-overlay-messages',
  template: `
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
  messages$ = this.store.select(MessagesSelectors.selectAllFormattedMessages);

  constructor(private store: Store) {}

  ngOnInit(): void {
    this.store.dispatch(MessagesActions.enter());
  }

  trackByFn(index: string, message: Message) {
    return message.id;
  }
}
