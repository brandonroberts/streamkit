import { Controller, Get, Response } from '@nestjs/common';

import { ApiConfig, EnvConfig } from '@ngtwitch/api-interfaces';

@Controller()
export class ApiConfigController {
  @Get('config')
  getConfig(@Response() resp) {
    const envConfig = process.env as unknown as EnvConfig;

    const config: ApiConfig = {
      twitchTvHandle: envConfig.TWITCH_HANDLE,
      twitchClientId: envConfig.TWITCH_CLIENT_ID,
      giphyApiKey: envConfig.GIPHY_API_KEY,
      chatbotOauthKey: envConfig.CHATBOT_OAUTH_KEY,
      callbackRoot: envConfig.TWITCH_WEBHOOK_ROOT
    };

    return resp.json(config);
  }
}
