import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { merge } from 'rxjs';

import { ChatBotService } from '../chatbot.service';
import { MessageService } from '../message.service';

@WebSocketGateway()
export class WsGateway {
  constructor(
    private chatbotService: ChatBotService,
    private messageService: MessageService
  ) {}

  @SubscribeMessage('subscribe')
  handleMessage() {
    return merge(this.chatbotService.events$, this.messageService.pinnedMessages$);
  }
}
