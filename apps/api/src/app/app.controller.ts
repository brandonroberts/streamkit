import { Controller, Get, Post, Body, Response, Query } from '@nestjs/common';

import { ChatBotService } from './chatbot.service';
import { FollowEvent } from './models/follow-event';

@Controller()
export class AppController {
  constructor(private chatbotService: ChatBotService) {
    chatbotService.init();
  }

  @Get('follows')
  getFollows(@Response() resp, @Query('hub.challenge') challenge: string) {
    return resp.send(challenge);
  }

  @Post('follows')
  postFollows(@Body() followEvent: FollowEvent, @Response() resp) {
    followEvent.data.forEach(followerInfo => {
      console.log(followerInfo);
      this.chatbotService.respond(`Thanks for the follow ${followerInfo.from_name}!`)
    });

    return resp.json({ success: true });
  }

}
