import { Injectable } from '@angular/core';
import { share } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class WebSocketEventSerivce {
  private _events$: WebSocketSubject<any> = webSocket(`ws://localhost:8000/ws/twitch-events/`);
  events$ = this._events$.pipe(share());

  connect(token: string) {
    this._events$.next({
      token
    });

    return this._events$;
  }
}