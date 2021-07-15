import { Injectable } from '@angular/core';
import { SharedActions, createEffect, ofType } from '@ngrx/effects';

import { concatMap, delay, filter, map } from 'rxjs/operators';
import { from } from 'rxjs';

import { TwitchActions } from '@streamkit/shared/actions';

import { alerts, followGif, raidGif, subGif } from '../../../config';
import { TAUWebSocketEventSerivce } from '../websocket/tau-websocket-events.service';
import * as AlertsActions from './alerts.actions';

@Injectable()
export class AlertsEffects {
  commandReceived$ = createEffect(() =>
    this.actions$.pipe(
      ofType(TwitchActions.command, TwitchActions.broadcast),
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

  raided$ = createEffect(() =>
    this.wsEventService.raids$.pipe(
      map((event) => {
        return AlertsActions.raidAlert({
          user: event.event_data.from_broadcaster_user_name,
          alert: {
            title: ` raided with ${event.event_data.viewers} viewers`,
            gif: raidGif,
            showMessage: true,
            duration: 8000,
            subsOnly: false,
          },
        });
      })
    )
  );

  followed$ = createEffect(() =>
    this.wsEventService.follows$.pipe(
      map((event) => {
        return AlertsActions.followAlert({
          user: event.event_data.user_name,
          alert: {
            title: '',
            gif: followGif,
            showMessage: false,
            duration: 6000,
            subsOnly: false,
          },
        });
      })
    )
  );

  subscribed$ = createEffect(() =>
    this.wsEventService.subs$.pipe(
      map((event) => {
        return AlertsActions.subAlert({
          user: event.event_data.data.message.user_name,
          alert: {
            title: ` subscribed!`,
            gif: subGif,
            showMessage: false,
            duration: 3000,
            subsOnly: false,
          },
        });
      })
    )
  );

  playAudioAndClearAlert$ = createEffect(() =>
    this.actions$.pipe(
      ofType(
        AlertsActions.commandAlert,
        AlertsActions.raidAlert,
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
    private actions$: SharedActions,
    private wsEventService: TAUWebSocketEventSerivce
  ) {}
}
