import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, switchMap, catchError, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { EMPTY } from 'rxjs';

import { AppConfigService } from '../../app-config.service';

@Component({
  selector: 'ngtwitch-auth-callback',
  template: `
    <p>
      auth-callback works!
    </p>
  `,
  styles: [
  ]
})
export class AuthCallbackComponent implements OnInit {
  private apiConfig = this.appConfigService.get();

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit(): void {
    this.route.fragment.pipe(
      mergeMap(hash => {
        const access_token_string = hash.split('&')[0];
        const token = access_token_string.replace('access_token=', '');
        console.log(token);
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Client-ID': this.apiConfig.twitchClientId
        };

        return this.http.get<{ data: any[] }>('https://api.twitch.tv/helix/users?login=brandontroberts', { headers }).pipe(
          switchMap(({data}) => {
            let url = `https://api.twitch.tv/helix/users/follows?first=1&to_id=${data[0].id}`;
            // url = `https://api.twitch.tv/helix/streams?user_id=${data[0].id}`;
            const hubData = {
              'hub.callback': `${this.apiConfig.callbackRoot}/api/follows`,
              'hub.mode': 'subscribe',
              'hub.topic': url,
              'hub.lease_seconds': 3600
            };

            return this.http.post('https://api.twitch.tv/helix/webhooks/hub', hubData, { headers }).pipe(catchError(() => EMPTY));
          })
        )
      }),
      first()
    ).subscribe();
  }

}
