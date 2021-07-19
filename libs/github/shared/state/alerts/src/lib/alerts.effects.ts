import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { map } from 'rxjs/operators';

import { githubStarGif } from '@streamkit/shared/config';

import * as AlertActions from './alert.actions';

@Injectable()
export class GitHubEffects {
  githubStar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertActions.githubStar),
      map((action) => {
        return AlertActions.githubStarAlert({
          user: action.username,
          alert: {
            title: ``,
            gif: githubStarGif,
            showMessage: false,
            duration: 5000,
            subsOnly: false,
          },
        });
      })
    )
  );

  constructor(
    private actions$: Actions
  ) {}
}
