import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { Actions, createEffect, OnInitEffects, ofType } from "@ngrx/effects";
import { webSocket } from 'rxjs/webSocket';
import { tap } from 'rxjs/operators';

import { environment } from "../../../../environments/environment";

import { init } from "./websocket.actions";

@Injectable()
export class WebSocketEffects {
  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(init),
      tap(() => {
        const subj = webSocket(`${environment.wsHost}`)
        subj.subscribe(this.store);

        subj.next({
          event: 'subscribe'
        });
        // const accessToken = localStorage.getItem('access_token');
        // const url = `wss://chat.api.restream.io/ws?accessToken=${accessToken}`;
        // const subj = webSocket(url);
        // subj.subscribe(console.log);
        // const connection = new WebSocket(url);
        // connection.onmessage = (message) => {
        //   // IUpdates interface is provided on the right
        //   const update = JSON.parse(message.data);
        //   console.log(update);
      // };
      
      // connection.onerror = console.error;
      })
    );
  }, { dispatch: false });

  constructor(private actions$: Actions, private store: Store) { }

  ngrxOnInitEffects() {
    return init();
  }
}