import { Module } from '@nestjs/common';

import { AppController } from './app.controller';
import { ChatBotService } from './chatbot.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [ChatBotService],
})
export class AppModule {}
