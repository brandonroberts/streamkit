import {
  Controller,
  Post,
  Body,
  Response,
  Get,
  Query,
  Redirect,
} from '@nestjs/common';
import { YouTubePollingService } from './youtube-polling.service';
import { YoutubeService } from './youtube.service';

@Controller()
export class YoutubeController {
  constructor(
    private youtubeService: YoutubeService,
    private youtubePollingService: YouTubePollingService
  ) {
    youtubeService.refreshAuthentication();
  }

  @Get('youtube/authorize')
  @Redirect()
  redirectToAuthorization() {
    let url = `https://accounts.google.com/o/oauth2/v2/auth?`;
    url += `scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fyoutube`;
    url += `&access_type=offline`;
    url += `&include_granted_scopes=true`;
    url += `&state=${process.env.YOUTUBE_STATE_KEY}`;
    url += `&redirect_uri=${process.env.YOUTUBE_AUTH_CALLBACK_URL}`;
    url += `&response_type=code`;
    url += `&client_id=${process.env.YOUTUBE_CLIENT_ID}`;

    return { url };
  }

  @Get('youtube/authorize/callback')
  async authorize(@Query('code') code: string, @Response() resp) {
    const data = await this.youtubeService.authenticate(code);

    if (data.error) {
      return resp.status(401).json({ success: false });
    }

    return resp.json({ success: true });
  }

  @Get('youtube/broadcasts')
  async getBroadcasts(@Response() resp) {
    const data = await this.youtubeService.getBroadcasts();

    if (data.error) {
      return resp.status(data.error.code).json({ success: false });
    }

    return resp.json(data);
  }

  @Get('youtube/subscriptions')
  async getSubscriptions(@Response() resp) {
    const data = await this.youtubeService.getSubscriptions();

    if (data.error) {
      return resp.status(data.error.code).json({ success: false });
    }

    return resp.json(data);
  }

  @Get('youtube/liveChatMessages')
  async getLiveChatMessages(
    @Query('liveChatId') liveChatId: string,
    @Query('nextPageToken') nextPageToken: string,
    @Response() resp
  ) {
    const data = await this.youtubeService.getLiveChatMessages(
      liveChatId,
      nextPageToken
    );

    if (data.error) {
      return resp.status(data.error.code).json({ success: false });
    }

    return resp.json(data);
  }

  @Post('youtube/liveChatMessages')
  async postLiveChatMessage(
    @Query('liveChatId') liveChatId: string,
    @Body() body: { message: string },
    @Response() resp
  ) {
    const data = await this.youtubeService.postChatMessage(
      liveChatId,
      body.message
    );

    if (data.error) {
      return resp.status(403).json({ success: false });
    }

    return resp.json({ success: true });
  }

  @Get('youtube/refresh')
  async authRefresh(@Response() resp) {
    const data = await this.youtubeService.refreshAuthentication();

    if (data.error) {
      return resp.status(401).json({ success: false });
    }

    return resp.json({ success: true });
  }

  @Get('youtube/start')
  async startPolling(
    @Query('liveChatId') liveChatId: string,
    @Response() resp
  ) {
    const data = await this.youtubePollingService.getInitialDataAndStartPolling(
      liveChatId
    );

    if (data.error) {
      return resp.status(401).json({ success: false });
    }

    return resp.json({ success: true });
  }

  @Get('youtube/stop')
  async stopPolling(@Response() resp) {
    this.youtubePollingService.stopPolling();

    return resp.json({ success: true });
  }
}
