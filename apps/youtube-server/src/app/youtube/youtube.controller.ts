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
    let url = this.youtubeService.getRedirectUrl();

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
    try {
      const response = await this.youtubeService.getBroadcasts();

      return resp.json(response.data);
    } catch (e) {
      return resp.status(401).json({ success: false });
    }
  }

  @Get('youtube/subscriptions')
  async getSubscriptions(@Response() resp) {
    try {
      const response = await this.youtubeService.getSubscriptions();

      return resp.json(response.data);
    } catch (e) {
      return resp.status(401).json({ success: false });
    }
  }

  @Get('youtube/liveChatMessages')
  async getLiveChatMessages(
    @Query('liveChatId') liveChatId: string,
    @Query('nextPageToken') nextPageToken: string,
    @Response() resp
  ) {
    try {
      const response = await this.youtubeService.getLiveChatMessages(
        liveChatId,
        undefined
      );

      return resp.json(response.data);
    } catch (e) {
      console.log(`${e}`);
      return resp.status(401).json({ success: false });
    }
  }

  @Post('youtube/liveChatMessages')
  async postLiveChatMessage(
    @Query('liveChatId') liveChatId: string,
    @Body() body: { message: string },
    @Response() resp
  ) {
    try {
      await this.youtubeService.postChatMessage(
        liveChatId,
        body.message
      );
      return resp.json({ success: true });
    } catch (e) {
      return resp.status(401).json({ success: false });
    }
  }

  @Get('youtube/refresh')
  async authRefresh(@Response() resp) {
    await this.youtubeService.refreshAuthentication();

    return resp.json({ success: true });
  }

  @Get('youtube/start')
  async startPolling(
    @Query('liveChatId') liveChatId: string,
    @Response() resp
  ) {
    // this.youtubePollingService.getInitialDataAndStartPolling(
    //   liveChatId
    // );

    return this.getLiveChatMessages(liveChatId, undefined, resp);
  }

  @Get('youtube/stop')
  async stopPolling(@Response() resp) {
    this.youtubePollingService.stopPolling();

    return resp.json({ success: true });
  }
}
