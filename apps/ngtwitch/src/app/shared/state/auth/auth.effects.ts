import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { concatMap, map, tap } from "rxjs/operators";

import { TwithAuthService } from "../../../twitch-auth.service";
import * as AuthActions from "./auth.actions";

@Injectable()
export class AuthEffects {
  authenticate$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.authCallbackEnter),
      concatMap(action => {
        const headers = {
          'Authorization': `Bearer ${action.token}`,
          'Client-ID': action.clientId
        };

        return this.twitchAuthService.authenticate(headers)
          .pipe(map(({ data }) => AuthActions.authSuccess({ data, headers })));
      }));
  });

  subscribeToFollows$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.authSuccess),
      concatMap(({ data, headers }) => {
        return this.twitchAuthService.subscribeToFollows(data[0].id, headers)
          .pipe(map(() => AuthActions.followSubscribeSuccess()))
      }));
  });

  followSubscribeSuccess$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AuthActions.followSubscribeSuccess),
      tap(() => {
        this.router.navigate(['/']);
      })
    );
  }, { dispatch: false })

  constructor(
    private actions$: Actions,
    private twitchAuthService: TwithAuthService,
    private router: Router
  ) { }
}