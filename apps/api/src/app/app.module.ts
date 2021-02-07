import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { ChatBotService } from './chatbot.service';
import { ApiConfigController } from './config.controller';
import { WsGateway } from './ws/ws.gateway';

@Module({
  controllers: [AppController, ApiConfigController],
  providers: [WsGateway, ChatBotService]
})
export class AppModule {}
