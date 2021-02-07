import { Controller, Get, Post, Body, Response, Query } from '@nestjs/common';

import { FollowEvent } from '@ngtwitch/models';
import { ChatBotService } from './chatbot.service';

@Controller()
export class TwitchWebookController {
  constructor(private chatbotService: ChatBotService) {
    chatbotService.init();
  }

  @Get('follows')
  getFollows(@Response() resp, @Query('hub.challenge') challenge: string) {
    return resp.send(challenge);
  }

  @Post('follows')
  postFollows(@Body() followEvent: FollowEvent, @Response() resp) {
    this.chatbotService.sendFollow(followEvent);

    return resp.json({ success: true });
  }

}
