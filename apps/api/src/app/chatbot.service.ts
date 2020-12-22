import { Injectable } from '@nestjs/common';

import ComfyJS from 'comfy.js';

@Injectable()
export class ChatBotService {
  init() {
    ComfyJS.Init(process.env.TWITCH_HANDLE, process.env.CHATBOT_OAUTH_KEY, ['brandontroberts']);
  }

  respond(message: string) {
    ComfyJS.Say(message, undefined);
  }
}
