import { HttpClient } from "@angular/common/http";
import { Injectable, Injector } from "@angular/core";
import { ApiConfig } from "@ngtwitch/api-interfaces";

import { AppConfigService } from "./app-config.service";

@Injectable({
  providedIn: 'root'
})
export class TwithAuthService {
  constructor(
    private http: HttpClient,
    private injector: Injector
  ) { }

  get apiConfig(): ApiConfig {
    return this.injector.get(AppConfigService).get();
  }

  authenticate(headers = {}) {
    return this.http.get<{ data: any[] }>('https://api.twitch.tv/helix/users?login=brandontroberts', { headers });
  }

  subscribeToFollows(userId: string, headers = {}) {
    let url = `https://api.twitch.tv/helix/users/follows?first=1&to_id=${userId}`;

    const hubData = {
      'hub.callback': `${this.apiConfig.callbackRoot}/api/follows`,
      'hub.mode': 'subscribe',
      'hub.topic': url,
      'hub.lease_seconds': 3600
    };

    return this.http.post('https://api.twitch.tv/helix/webhooks/hub', hubData, { headers });

  }
}