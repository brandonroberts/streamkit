import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { map } from 'rxjs/operators';

import { GitHubActions } from '@streamkit/shared/actions';

import { githubStarGif } from '../../../config';

import * as AlertsActions from './alerts.actions';

@Injectable()
export class GithubAlertsEffects {
  githubStar$ = createEffect(() =>
    this.actions$.pipe(
      ofType(GitHubActions.githubStar),
      map((action) => {
        return AlertsActions.githubStarAlert({
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

  constructor(private actions$: Actions) {}
}
