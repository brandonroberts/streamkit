import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { of } from "rxjs";
import { delay, map, switchMap } from "rxjs/operators";
import { TwitchActions } from "@streamkit/actions";

import * as MessagesActions from "./messages.actions";
import * as YouTubeActions from '../youtube/youtube.actions';

@Injectable()
export class MessagesEffects {
  clearMessages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TwitchActions.message, YouTubeActions.message),
      switchMap(() => of(null).pipe(
        delay(15000),
        map(() => MessagesActions.messagesCleared()))
      )
    );
  }, { dispatch: false });

  constructor(private actions$: Actions) { }
}
