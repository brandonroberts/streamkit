import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { share } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

@Injectable({
  providedIn: 'root',
})
export class APIWebSocketEventSerivce {
  private _events$: WebSocketSubject<any> = webSocket(environment.wsHost);
  events$ = this._events$.pipe(share());

  connect() {
    this._events$.next({
      event: 'subscribe',
    });

    return this._events$;
  }
}
