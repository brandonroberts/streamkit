import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';

import { MessagesActions, MessagesSelectors } from '@streamkit/youtube/shared/state/messages';

@Component({
  selector: 'youtube-overlay-pinned-message',
  template: `
    <ion-item class="bg" *ngIf="pinnedMessage$ | async as message" lines="none">
      <ion-avatar slot="start">
        <img src="{{ message.avatarUrl }}">
      </ion-avatar>

      <ion-label class="ion-text-wrap">
        <div class="msg" [innerHTML]="message.formattedMessage"></div>
      </ion-label>
    </ion-item>
  `,
  styles: [`
     :host .bg {
       --background: rgb(0, 0, 0, 0.9);
     }

     .msg {
       color: white;
       font-size: 24px;
     }
  `]
})
export class PinnedMessageComponent implements OnInit {
  pinnedMessage$ = this.store.select(MessagesSelectors.selectPinnedMessage);

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.store.dispatch(MessagesActions.pinnedMessageEnter());
  }

}
