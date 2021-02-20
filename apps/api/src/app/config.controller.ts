import { Controller, Get, Response } from '@nestjs/common';

import { ApiConfig, EnvConfig } from '@ngtwitch/api-interfaces';

@Controller()
export class ApiConfigController {
  @Get('config')
  getConfig(@Response() resp) {
    const envConfig = process.env as unknown as EnvConfig;

    const config: ApiConfig = {
      twitchClientId: envConfig.TWITCH_CLIENT_ID,
      giphyApiKey: envConfig.GIPHY_API_KEY,
      callbackRoot: envConfig.TWITCH_WEBHOOK_ROOT
    };

    return resp.json(config);
  }
}
