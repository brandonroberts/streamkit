import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ChatBotService } from './chatbot.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, ChatBotService],
})
export class AppModule {}
