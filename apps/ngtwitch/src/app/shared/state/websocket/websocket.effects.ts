import { Injectable } from "@angular/core";
import { Actions, createEffect, OnInitEffects, ofType } from "@ngrx/effects";
import { mergeMap } from 'rxjs/operators';

import { environment } from "../../../../environments/environment";

import { init } from "./websocket.actions";
import { WebSocketEventSerivce } from './websocket-events.service';

@Injectable()
export class WebSocketEffects implements OnInitEffects {
  init$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(init),
      mergeMap(() => this.wsEventService.connect(environment.wsToken))
    );
  }, { dispatch: false });

  constructor(
    private actions$: Actions,
    private wsEventService: WebSocketEventSerivce
  ) { }

  ngrxOnInitEffects() {
    return init();
  }
}