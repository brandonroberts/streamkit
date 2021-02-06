import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { ChatBotService } from './chatbot.service';
import { ApiConfigController } from './config.controller';

@Module({
  imports: [],
  controllers: [AppController, ApiConfigController],
  providers: [ChatBotService],
})
export class AppModule {}
