import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';

import { ChatBotService } from '../chatbot.service';

@WebSocketGateway()
export class WsGateway {
  constructor(private chatbotService: ChatBotService) {}

  @SubscribeMessage('subscribe')
  handleMessage() {
    return this.chatbotService.command$;
  }
}
