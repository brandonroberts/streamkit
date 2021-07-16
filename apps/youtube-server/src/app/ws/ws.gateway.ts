import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { merge } from 'rxjs';

import { YouTubePollingService } from '../youtube/youtube-polling.service';

@WebSocketGateway()
export class WsGateway {
  constructor(private youtubePollingService: YouTubePollingService) {}

  @SubscribeMessage('subscribe')
  handleMessage() {
    return merge(this.youtubePollingService.messages$);
  }
}
