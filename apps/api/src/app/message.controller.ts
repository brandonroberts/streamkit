import { Body, Controller, Get, Post, Response } from '@nestjs/common';
import { MessageService } from './message.service';


@Controller()
export class MessageController {
  @Post('pinMessage')
  pinMessage(@Body() body, @Response() resp) {
    this.messageService.pinMessage(body.id);

    return resp.json({ success: true });
  }

  constructor(private messageService: MessageService) {}
}
