import { Module } from '@nestjs/common';

import { ChatBotService } from './chatbot.service';
import { ApiConfigController } from './config.controller';
import { TwitchWebookController } from './twitch-webhook.controller';
import { WsGateway } from './ws/ws.gateway';

@Module({
  controllers: [TwitchWebookController, ApiConfigController],
  providers: [WsGateway, ChatBotService]
})
export class AppModule {}
