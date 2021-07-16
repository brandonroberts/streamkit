import { Injectable } from '@nestjs/common';
import { YouTubeConfigService } from './config.service';
const fetch = require('node-fetch');

@Injectable()
export class YoutubeService {
  constructor(private config: YouTubeConfigService) {}

  async authenticate(code: string) {
    return await this.config.getAccessToken(code);
  }

  async refreshAuthentication() {
    return await this.config.refreshAccessToken();
  }

  async getBroadcasts() {
    const query = `?part=snippet,contentDetails,status&broadcastStatus=all`;
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/liveBroadcasts${query}`,
      {
        headers: this.config.getHeaders(),
      }
    );

    return await response.json();
  }

  async getLiveChatMessages(liveChatId: string, nextPageToken: string) {
    const query = `?liveChatId=${liveChatId}&part=id,snippet,authorDetails`;
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/liveChat/messages${query}`,
      {
        headers: this.config.getHeaders(),
      }
    );

    return await response.json();
  }

  async getSubscriptions() {
    const query = `?part=subscriberSnippet&myRecentSubscribers=true&maxResults=25`;
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/subscriptions${query}`,
      {
        headers: this.config.getHeaders(),
      }
    );

    return await response.json();
  }

  async postChatMessage(liveChatId: string, message: string) {
    const query = `?part=snippet`;
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/liveChat/messages${query}`,
      {
        method: 'POST',
        headers: this.config.getHeaders(),
        body: JSON.stringify({
          snippet: {
            liveChatId,
            type: 'textMessageEvent',
            textMessageDetails: {
              messageText: message,
            },
          },
        }),
      }
    );

    return await response.json();
  }
}
