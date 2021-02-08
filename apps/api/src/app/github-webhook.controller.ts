import { Controller, Post, Body, Response } from '@nestjs/common';

import { ChatBotService } from './chatbot.service';

@Controller()
export class GitHubWebookController {
  constructor(private chatbotService: ChatBotService) {}

  @Post('github/star')
  postFollows(@Body() starEvent: any, @Response() resp) {
    const payload = JSON.parse(starEvent.payload);

    if (payload.starred_at) {
      this.chatbotService.sendGitHubStar(payload.sender.login);
    }

    return resp.json({ success: true });
  }

}
