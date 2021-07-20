import { Injectable } from '@nestjs/common';
import { Subject } from 'rxjs';

import { YouTubeWebSocketActions } from '@streamkit/youtube/shared/actions'

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
      await this.pollData(liveChatId, true);
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

  private async pollData(liveChatId: string, first: boolean) {
    let pollInterval = 2000;

    this.inProgress = true;

    try {
      await this.pollMessages(liveChatId, undefined, first);
      // await this.pollSubscriptions(first);
    } catch (e) { }

    console.log('next poll in', pollInterval);

    // sleep according to the poll interval
    await this.sleepFor(pollInterval);

    this.inProgress = false;

    // poll messages again
    if (this.polling) {
      await this.pollData(liveChatId, false);
    }
  }

  private async pollMessages(
    liveChatId: string,
    nextPageToken: string,
    first: boolean
  ) {
    try {
      const data = await this.youtubeService.getLiveChatMessages(
        liveChatId,
        nextPageToken
      );

      if (data.error) {
        throw new Error(data.error);
      }

      if (first) {
        this._messages$.next(YouTubeWebSocketActions.loadedMessages({
          data: { liveChatId, messages: data.items },
        }));

        this.storedMessages = Array.isArray(data.items) ? data.items : [];
      } else {
        const messageIds = this.storedMessages.map((message) => message.id);
        const newMessages = (data.items || []).filter(
          (item) => !messageIds.includes(item.id)
        );

        if (newMessages.length) {
          console.log(`polled ${newMessages.length} messages`);

          this._messages$.next(YouTubeWebSocketActions.polledMessages({
            data: { liveChatId, messages: newMessages },
          }));
          this.storedMessages = [...this.storedMessages, ...newMessages];
        }
      }
    } catch (e) {
      console.log('error polling messages', e);
    }
  }

  private async pollSubscriptions(first: boolean) {
    try {
      const subscriptionData = await this.youtubeService.getSubscriptions();

      if (subscriptionData.error) {
        throw new Error(subscriptionData.error);
      }

      if (first) {
        this._messages$.next(YouTubeWebSocketActions.loadedSubscribers({
          data: { subscriptions: subscriptionData.items },
        }));

        this.storedSubscriptions = Array.isArray(subscriptionData.items)
          ? subscriptionData.items
          : [];
      } else {
        const subIds = this.storedSubscriptions.map((sub) => sub.id);
        const newSubs = (subscriptionData.items || []).filter(
          (item) => !subIds.includes(item.id)
        );

        if (newSubs.length) {
          console.log(`polled ${newSubs.length} subscriptions`);

          this._messages$.next(YouTubeWebSocketActions.polledSubscribers({
            data: { subscriptions: newSubs },
          }));
          this.storedSubscriptions = [...this.storedSubscriptions, ...newSubs];
        }
      }
    } catch (e) {
      console.log('error polling subscriptions');
    }
  }

  private async sleepFor(sleepForMilliseconds: number) {
    const sleeper = new Promise((res) => {
      setTimeout(res, sleepForMilliseconds);
    });

    await sleeper;
  }
}
