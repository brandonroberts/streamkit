import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { first, switchMap, catchError, mergeMap } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { EMPTY } from 'rxjs';

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

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    this.route.fragment.pipe(
      mergeMap(hash => {
        const access_token_string = hash.split('&')[0];
        const token = access_token_string.replace('access_token=', '');
        console.log(token);
        const headers = {
          'Authorization': `Bearer ${token}`,
          'Client-ID': environment.twitchClientId
        };

        return this.http.get<{ data: any[] }>('https://api.twitch.tv/helix/users?login=brandontroberts', { headers }).pipe(
          switchMap(({data}) => {
            let url = `https://api.twitch.tv/helix/users/follows?first=1&to_id=${data[0].id}`;
            // url = `https://api.twitch.tv/helix/streams?user_id=${data[0].id}`;
            const hubData = {
              'hub.callback': `${environment.callbackRoot}/api/follows`,
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
