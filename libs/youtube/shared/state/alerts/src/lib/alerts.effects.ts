import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { concatMap, delay, filter, map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';

import { alerts } from '@streamkit/shared/config';
import { Command } from '@streamkit/shared/models';
import { GitHubAlertActions } from '@streamkit/github/shared/state/alerts';
import { YouTubeChatActions } from '@streamkit/youtube/shared/actions';
import { GifSearchService } from '@streamkit/youtube/data-access-gif';

import * as AlertsActions from './alerts.actions';

const onCommand = (chatCommand: string) => (source$: Observable<Command>) => {
  return source$.pipe(filter(({ command }) => command === chatCommand));
};

@Injectable()
export class AlertsEffects {
  commandReceived$ = createEffect(() =>
    this.actions$.pipe(
      ofType(YouTubeChatActions.command),
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

  showGif$ = createEffect(() =>
    this.actions$.pipe(
      ofType(YouTubeChatActions.command),
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
        GitHubAlertActions.githubStarAlert
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
