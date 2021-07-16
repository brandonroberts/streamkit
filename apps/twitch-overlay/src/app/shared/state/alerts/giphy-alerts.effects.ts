import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { Observable } from 'rxjs';
import { concatMap, delay, filter, map } from 'rxjs/operators';

import { TwitchActions } from '@streamkit/twitch/shared/actions';
import { Command } from '@streamkit/twitch/shared/models';

import { GifSearchService } from '../../../gif-search.service';
import * as AlertsActions from './alerts.actions';

const onCommand = (chatCommand: string) => (source$: Observable<Command>) => {
  return source$.pipe(filter(({ command }) => command === chatCommand));
};

@Injectable()
export class GiphyAlertsEffects {
  showGif$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TwitchActions.broadcast),
      map((action) => action.command),
      onCommand('gif'),
      concatMap(({ message }) => {
        return this.gifSearchService.search(message).pipe(
          map((gifUrl) =>
            AlertsActions.gifAlert({
              text: '',
              searchTerms: message,
              gifUrl,
            })
          )
        );
      })
    )
  );

  clearGif$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AlertsActions.gifAlert),
      delay(5000),
      map(() => AlertsActions.gifCleared())
    )
  );

  constructor(
    private actions$: Actions,
    private gifSearchService: GifSearchService
  ) {}
}
