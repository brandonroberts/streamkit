import { Injectable } from "@angular/core";
import { Action, Store } from '@ngrx/store';
import { Actions, createEffect, OnInitEffects, ofType } from "@ngrx/effects";
import { webSocket } from 'rxjs/webSocket';
import { map, switchMap, tap } from 'rxjs/operators';

import { init } from "./websocket.actions";

@Injectable()
export class WebSocketEffects implements OnInitEffects {
  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(init),
      tap(() => {
        const subj = webSocket('ws://localhost:3333')
        subj.subscribe(this.store);

        subj.next({
          event: 'subscribe'
        });
      })
    );
  }, { dispatch: false });

  constructor(private actions$: Actions, private store: Store) { }

  ngrxOnInitEffects() {
    return init();
  }
}