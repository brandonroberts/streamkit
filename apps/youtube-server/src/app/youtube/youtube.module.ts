import { Module } from '@nestjs/common';

import { YoutubeController } from './youtube.controller';
import { YouTubeConfigService } from './config.service';
import { YoutubeService } from './youtube.service';
import { YouTubePollingService } from './youtube-polling.service';

@Module({
  controllers: [YoutubeController],
  providers: [YoutubeService, YouTubeConfigService, YouTubePollingService],
  exports: [YouTubePollingService]
})
export class YouTubeModule { }
