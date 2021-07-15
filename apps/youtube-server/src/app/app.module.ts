import { Module } from '@nestjs/common';

import { WsGateway } from './ws/ws.gateway';
import { YouTubeModule } from './youtube/youtube.module';

@Module({
  imports: [
    YouTubeModule
  ],
  controllers: [
  ],
  providers: [
    WsGateway
  ]
})
export class AppModule { }
