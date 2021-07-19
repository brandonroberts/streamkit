import { Inject, Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { webSocket } from 'rxjs/webSocket';
import { tap } from 'rxjs/operators';

import { EnvironmentConfig, ENVIRONMENT } from '@streamkit/youtube/shared/environment';

import { init } from './websocket.actions';

@Injectable()
export class WebSocketEffects {
  init$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(init),
        tap(() => {
          const subj = webSocket(`${this.environment.wsHost}`);
          subj.subscribe(this.store);

          subj.next({
            event: 'subscribe',
          });
        })
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    @Inject(ENVIRONMENT) private environment: EnvironmentConfig 
  ) {}

  ngrxOnInitEffects() {
    return init();
  }
}
