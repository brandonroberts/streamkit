import { Component, OnInit } from '@angular/core';

import { AppConfigService } from '../../app-config.service';

@Component({
  selector: 'ngtwitch-auth',
  template: `
    <button (click)="onAuthorize()">Authorize</button>
  `,
  styles: [
  ]
})
export class AuthComponent implements OnInit {
  private apiConfig = this.appConfigService.get();

  constructor(
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
  }

  onAuthorize() {
    let url = `https://id.twitch.tv/oauth2/authorize`;
    url += `?client_id=${this.apiConfig.twitchClientId}`;
    url += `&redirect_uri=http://localhost:4200/auth-callback`;
    url += `&response_type=token`;
    url += `&scope=chat:read+user:read:email`;

    window.location.href = url;
  }

}
