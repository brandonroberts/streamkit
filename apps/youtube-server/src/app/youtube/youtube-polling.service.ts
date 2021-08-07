import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

import { YouTubeWebSocketActions } from '@streamkit/youtube/shared/actions';

import { YoutubeService } from './youtube.service';

@Injectable()
export class YouTubePollingService {
  private _messages$ = new Subject<any>();
  messages$ = this._messages$.asObservable();
  private polling = false;
  private inProgress = false;
  private storedMessages = [];
  private storedSubscriptions = [];

  constructor(private youtubeService: YoutubeService) { }

  async getInitialDataAndStartPolling(liveChatId: string) {
    this.polling = true;

    if (!this.inProgress) {
      console.log('started polling');
      this.pollMessages(liveChatId, undefined, true);
      this.pollSubscriptions(true);
    } else {
      console.log('polling in progress');
    }

    return { error: false };
  }

  stopPolling() {
    if (this.polling) {
      this.polling = false;
      console.log('stopped polling');
    }
  }

  private async pollMessages(
    liveChatId: string,
    nextPageToken: string,
    first: boolean
  ) {
    this.youtubeService.getLiveChatMessages(
      liveChatId,
      nextPageToken
    ).then(response => {
      const data = response.data;
      const dataMessages = data.items;
      const nextPoll = data.pollingIntervalMillis;
      const newMessages = dataMessages.filter(message => !this.storedMessages.find(msg => msg.id === message.id));
      this.storedMessages = [...this.storedMessages, ...newMessages];

      if (newMessages.length) {
        if (first) {
          console.log(`loaded ${newMessages.length} messages`);

          this._messages$.next(YouTubeWebSocketActions.loadedMessages({
            data: { liveChatId, messages: newMessages },
          }));
        } else {
          console.log(`polled ${newMessages.length} messages`);

          this._messages$.next(YouTubeWebSocketActions.polledMessages({
            data: { liveChatId, messages: newMessages },
          }));
        }
      }

      if (this.polling) {
        console.log(`next messages poll in ${nextPoll}`);

        setTimeout(() => {
          this.pollMessages(liveChatId, data.nextPageToken, false);
        }, nextPoll);
      }
    }).catch(() => {
      const nextPoll = 2000;

      if (this.polling) {
        console.log(`messages poll failed, next poll in ${nextPoll}`);

        setTimeout(() => {
          this.pollMessages(liveChatId, undefined, false);
        }, nextPoll);
      }
    });
  }

  private pollSubscriptions(first: boolean) {
    const nextPoll = 5000;

    this.youtubeService.getSubscriptions().then(response => {
      const data = response.data;
      const dataSubscriptions = data.items;
      const newSubscriptions = dataSubscriptions.filter(message => !this.storedSubscriptions.find(msg => msg.id === message.id));
      this.storedSubscriptions = [...this.storedSubscriptions, ...newSubscriptions];

      if (newSubscriptions.length) {
        if (first) {
          console.log(`loaded ${newSubscriptions.length} subscriptions`);

          this._messages$.next(YouTubeWebSocketActions.loadedSubscribers({
            data: { subscriptions: newSubscriptions },
          }));
        } else {
          console.log(`polled ${newSubscriptions.length} subscriptions`);

          this._messages$.next(YouTubeWebSocketActions.polledSubscribers({
            data: { subscriptions: newSubscriptions },
          }));
        }
      }

      if (this.polling) {
        console.log(`next subscriptions poll in ${nextPoll}`);

        setTimeout(() => {
          this.pollSubscriptions(false);
        }, nextPoll);
      }
    }).catch(() => {
      if (this.polling) {
        console.log(`subscriptions poll failed, next poll in ${nextPoll}`);

        setTimeout(() => {
          this.pollSubscriptions(false);
        }, nextPoll);
      }
    });    
  }
}
