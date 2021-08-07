import { Injectable } from '@nestjs/common';
import { YouTubeConfigService } from './config.service';
import { google } from 'googleapis';

@Injectable()
export class YoutubeService {
  private readonly youtubeAPI = google.youtube({
    version: 'v3',
    auth: this.config.oauth2Client
  });

  constructor(private config: YouTubeConfigService) {}

  getRedirectUrl() {
    return this.config.getRedirectUrl();
  }

  async authenticate(code: string) {
    return await this.config.getAccessToken(code);
  }

  async refreshAuthentication() {
    return await this.config.refreshAccessToken();
  }

  async getBroadcasts() {
    return await this.youtubeAPI.liveBroadcasts.list({
      part: ['snippet', 'contentDetails', 'status'],
      broadcastStatus: 'all'
    });
  }

  async getLiveChatMessages(liveChatId: string, nextPageToken: string) {
    return await this.youtubeAPI.liveChatMessages.list({
      liveChatId,
      part: ['id', 'snippet', 'authorDetails'],
      pageToken: nextPageToken
    });
  }

  async getSubscriptions() {
    return await this.youtubeAPI.subscriptions.list({
      part: ['subscriberSnippet'],
      myRecentSubscribers: true,
      maxResults: 25
    });
  }

  async postChatMessage(liveChatId: string, message: string) {
    return this.youtubeAPI.liveChatMessages.insert({
      part: ['snippet'],
      requestBody: {
        snippet: {
          liveChatId,
          type: 'textMessageEvent',
          textMessageDetails: {
            messageText: message,
          }
        }
      }
    });
  }
}
