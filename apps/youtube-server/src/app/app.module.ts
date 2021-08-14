import { Module } from '@nestjs/common';

import { WsGateway } from './ws/ws.gateway';
import { YouTubeModule } from './youtube/youtube.module';
import { MessageModule } from './message/message.module';

@Module({
  imports: [YouTubeModule, MessageModule],
  controllers: [],
  providers: [WsGateway],
})
export class AppModule {}
