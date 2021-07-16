import { Module } from '@nestjs/common';

import { ChatBotService } from './chatbot.service';
import { GitHubWebookController } from './github-webhook.controller';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { WsGateway } from './ws/ws.gateway';

@Module({
  controllers: [GitHubWebookController, MessageController],
  providers: [WsGateway, ChatBotService, MessageService],
})
export class AppModule {}
