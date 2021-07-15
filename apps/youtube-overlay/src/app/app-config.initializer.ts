import { APP_INITIALIZER } from "@angular/core";

import { AppConfigService } from './app-config.service';

function getApiConfig(appConfig: AppConfigService) {
  return () => appConfig.fetch();
}

export const AppConfigInitializer = [
  { provide: APP_INITIALIZER, useFactory: getApiConfig, deps: [AppConfigService], multi: true }
]