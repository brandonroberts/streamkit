import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../environments/environment';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TwitchService {
  constructor(private http: HttpClient) {}

  getUserProfileUrl(user: string) {
    return this.http
      .get(`${environment.apiHost}/api/twitch/helix/users/?login=${user}`, {
        headers: {
          Authorization: `Token ${environment.wsToken}`,
        },
      })
      .pipe(map((response: any) => response.data[0].profile_image_url));
  }
}
