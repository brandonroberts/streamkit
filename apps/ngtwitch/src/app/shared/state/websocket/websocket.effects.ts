import { Injectable } from "@angular/core";
import { Store } from '@ngrx/store';
import { Actions, createEffect, OnInitEffects, ofType } from "@ngrx/effects";
import { webSocket } from 'rxjs/webSocket';
import { tap } from 'rxjs/operators';

import { environment } from "../../../../environments/environment";

import { init } from "./websocket.actions";

@Injectable()
export class WebSocketEffects implements OnInitEffects {
  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(init),
      tap(() => {
        const subj = webSocket(`${environment.wsHost}`)
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