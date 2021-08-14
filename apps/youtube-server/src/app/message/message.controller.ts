import { Body, Controller, Get, Post, Response } from '@nestjs/common';
import { MessageService } from './message.service';

@Controller()
export class MessageController {
  @Post('youtube/messages/pin')
  pinMessage(@Body() body, @Response() resp) {
    this.messageService.pinMessage(body.id);

    return resp.json({ success: true });
  }

  constructor(private messageService: MessageService) {}
}
