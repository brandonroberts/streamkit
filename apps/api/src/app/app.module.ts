import { Module } from '@nestjs/common';

import { ChatBotService } from './chatbot.service';
import { ApiConfigController } from './config.controller';
import { GitHubWebookController } from './github-webhook.controller';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { TwitchWebookController } from './twitch-webhook.controller';
import { WsGateway } from './ws/ws.gateway';

@Module({
  controllers: [
    TwitchWebookController,
    ApiConfigController,
    GitHubWebookController,
    MessageController
  ],
  providers: [WsGateway, ChatBotService, MessageService]
})
export class AppModule {}
