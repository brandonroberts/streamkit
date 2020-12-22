import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'ngtwitch-auth',
  template: `
    <button (click)="onAuthorize()">Authorize</button>
  `,
  styles: [
  ]
})
export class AuthComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  onAuthorize() {
    let url = `https://id.twitch.tv/oauth2/authorize`;
    url += `?client_id=${environment.twitchClientId}`;
    url += `&redirect_uri=http://localhost:4200/auth-callback`;
    url += `&response_type=token`;
    url += `&scope=chat:read+user:read:email`;

    window.location.href = url;
  }

}
