import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { concatMap, delay, filter, map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';

import { GitHubActions } from '@streamkit/shared/actions';
import { Command } from '@streamkit/shared/models';

import { alerts, githubStarGif } from '../../../config';
import { GifSearchService } from '../../../gif-search.service';
import * as YouTubeActions from '../youtube/youtube.actions';
import * as AlertsActions from './alerts.actions';

const onCommand = (chatCommand: string) => (source$: Observable<Command>) => {
  return source$.pipe(filter(({ command }) => command === chatCommand));
};

@Injectable()
export class AlertsEffects {
  commandReceived$ = createEffect(() =>
    this.actions$.pipe(
      ofType(YouTubeActions.command),
      filter(({ command: commandInfo }) => !!alerts[commandInfo.command]),
      map(({ command }) => {
        const commandInfo = command;
        const alert = alerts[commandInfo.command];
        const user = alert.showMessage ? commandInfo.message : commandInfo.user;

        if (
          alert.subsOnly &&
          !commandInfo.flags.subscriber &&
          !commandInfo.flags.broadcaster
        ) {
          return AlertsActions.subOnlyAlert();
        }

        return AlertsActions.commandAlert({ user, alert });
      })
    )
  );

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

  showGif$ = createEffect(() =>
    this.actions$.pipe(
      ofType(YouTubeActions.command),
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

  playAudioAndClearAlert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AlertsActions.commandAlert,
        AlertsActions.followAlert,
        AlertsActions.subAlert,
        AlertsActions.githubStarAlert
      ),
      concatMap(({ alert }) => {
        const audio = alert.audio
          ? alert.audio.play().catch((e) => console.warn(e))
          : Promise.resolve(true);

        return from(audio).pipe(
          delay(alert.duration),
          map(() => AlertsActions.alertCleared())
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private gifSearchService: GifSearchService
  ) {}
}
