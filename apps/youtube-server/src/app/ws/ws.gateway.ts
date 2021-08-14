import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { merge } from 'rxjs';

import { YouTubePollingService } from '../youtube/youtube-polling.service';
import { MessageService } from '../message/message.service';

@WebSocketGateway()
export class WsGateway {
  constructor(
    private youtubePollingService: YouTubePollingService,
    private messageService: MessageService
  ) {}

  @SubscribeMessage('subscribe')
  handleMessage() {
    return merge(this.youtubePollingService.messages$, this.messageService.pinnedMessages$);
  }
}
