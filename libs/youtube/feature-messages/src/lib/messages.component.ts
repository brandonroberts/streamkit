import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Store } from '@ngrx/store';
import { Message } from '@streamkit/youtube/shared/models';
import {
  MessagesActions,
  MessagesSelectors
} from '@streamkit/youtube/shared/state/messages';


@Component({
  selector: 'youtube-overlay-messages',
  template: `
    <ion-list>
      <ion-item
        @messageAnimation
        class="bg"
        *ngFor="let message of messages$ | async; trackBy: trackByFn">
        <ion-avatar slot="start">
          <img src="{{ message.avatarUrl }}" />
        </ion-avatar>

        <ion-label class="ion-text-wrap">
          <div [style.color]="message.userColor" [innerHTML]="message.formattedMessage"></div>
        </ion-label>
      </ion-item>
    </ion-list>
  `,
  styles: [`
    :host {
      display: flex;
      flex-direction: row;
    }

    :host .bg {
      --background: rgb(0, 0, 0, 0);
    }

    ion-list {
      background-color: transparent;
      align-self: flex-end;
    }

    ion-content {
      padding: 0
    }
  `],
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
  ]
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
