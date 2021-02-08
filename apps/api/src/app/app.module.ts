import { Module } from '@nestjs/common';

import { ChatBotService } from './chatbot.service';
import { ApiConfigController } from './config.controller';
import { GitHubWebookController } from './github-webhook.controller';
import { TwitchWebookController } from './twitch-webhook.controller';
import { WsGateway } from './ws/ws.gateway';

@Module({
  controllers: [
    TwitchWebookController,
    ApiConfigController,
    GitHubWebookController
  ],
  providers: [WsGateway, ChatBotService]
})
export class AppModule {}
