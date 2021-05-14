import { Injectable } from '@angular/core';
import { share } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root'
})
export class APIWebSocketEventSerivce {
  private _events$: WebSocketSubject<any> = webSocket(`ws://localhost:3333`);
  events$ = this._events$.pipe(share());

  connect() {
    this._events$.next({
      event: 'subscribe'
    });

    return this._events$;
  }
}