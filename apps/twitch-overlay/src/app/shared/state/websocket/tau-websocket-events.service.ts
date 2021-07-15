import { Injectable } from '@angular/core';
import { environment } from 'apps/ngtwitch/src/environments/environment';
import { Observable } from 'rxjs';
import { filter, share } from 'rxjs/operators';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';

const ofEvent = (event: string) => (source$: Observable<any>) => {
  return source$.pipe(filter((eventData) => eventData.event_type === event));
};

@Injectable({
  providedIn: 'root',
})
export class TAUWebSocketEventSerivce {
  private _events$: WebSocketSubject<any> = webSocket(environment.tauWs);
  events$ = this._events$.pipe(share());
  raids$ = this.events$.pipe(ofEvent('raid'));
  follows$ = this.events$.pipe(ofEvent('follow'));
  subs$ = this.events$.pipe(ofEvent('subscribe'));

  connect(token: string) {
    this._events$.next({
      token,
    });

    return this._events$;
  }
}
