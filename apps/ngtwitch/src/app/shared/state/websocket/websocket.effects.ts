import { Injectable } from "@angular/core";
import { Actions, createEffect, OnInitEffects, ofType } from "@ngrx/effects";
import { mergeMap } from 'rxjs/operators';

import { environment } from "../../../../environments/environment";

import { init } from "./websocket.actions";
import { TAUWebSocketEventSerivce } from './tau-websocket-events.service';
import { APIWebSocketEventSerivce } from './websocket-events.service';

@Injectable()
export class WebSocketEffects implements OnInitEffects {
  connectToTAU$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(init),
      mergeMap(() => this.wsEventService.connect(environment.wsToken))
    );
  }, { dispatch: false });

  connectToAPI$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(init),
      mergeMap(() => this.apiWebSocketEventService.connect())
    );
  });

  constructor(
    private actions$: Actions,
    private apiWebSocketEventService: APIWebSocketEventSerivce,
    private wsEventService: TAUWebSocketEventSerivce
  ) { }

  ngrxOnInitEffects() {
    return init();
  }
}