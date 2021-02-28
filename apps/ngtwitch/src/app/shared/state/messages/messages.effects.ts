import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { TwitchActions } from "@ngtwitch/actions";

import * as MessagesActions from "./messages.actions";
import { delay, map, switchMap } from "rxjs/operators";

@Injectable()
export class MessagesEffects {
  clearMessages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TwitchActions.message),
      switchMap(() => of(null).pipe(
        delay(15000),
        map(() => MessagesActions.messagesCleared()))
      )
    );
  }, { dispatch: false });

  constructor(private actions$: Actions) { }
}
