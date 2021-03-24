import { trigger, state, style, transition, animate } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';
import { MessageService } from '../../message.service';

import { MessagesSelectors } from '../../shared/state/messages';

@Component({
  selector: 'ngtwitch-messages',
  template: `
    <div *ngIf="pinnedMessage$ | async as pinnedMessage">
      <div>
        <span [style.color]="pinnedMessage.userColor">{{ pinnedMessage.user }}</span>: 
        <span [innerHTML]="pinnedMessage.formattedMessage"></span>
        <button (click)="pinMessage()">Unpin Message</button>
      </div>
    </div>

    <div [@messageAnimation]="'in'" class="message" *ngFor="let message of messages$ | async">
      <div>
        <span [style.color]="message.userColor">{{ message.user }}</span>: 
        <span [innerHTML]="message.formattedMessage"></span>
        <button (click)="pinMessage(message.id)">Pin Message</button>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        max-height: 600px;
      }

      .message {
        display: flex;
        flex-direction: row;
        border: 2px black solid;
        background: black;
        padding: 8px;
        color: white;
      }
      
      .user {
        padding-bottom: 4px;
      }
    `
  ],
  animations: [
    trigger('messageAnimation', [
      state('in', style({ transform: 'translateX(0)' })),
      transition('void => *', [
        style({ transform: 'translateX(-100%)' }),
        animate(300)
      ]),
      transition('* => void', [
        animate(200, style({ transform: 'translateX(-100%)' }))
      ])
    ])
  ]
})
export class MessagesComponent implements OnInit {
  pinnedMessage$ = this.store.select(MessagesSelectors.selectPinnedMessage);
  messages$ = this.store.select(MessagesSelectors.selectAllMessages);

  constructor(
    private store: Store,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
  }

  pinMessage(id?: string) {
    this.messageService.pinMessage(id).subscribe();
    // this.pinnedMessage = message;
  }
}
