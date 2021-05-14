import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { concatMap, delay, filter, map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';

import { GitHubActions, TwitchActions } from '@ngtwitch/actions';
import { Command } from '@ngtwitch/models';

import { alerts, followGif, githubStarGif, raidGif, subGif } from '../../../config';
import { GifSearchService } from '../../../gif-search.service';
import * as AlertsActions from './alerts.actions';
import { WebSocketEventSerivce } from '../websocket/websocket-events.service';

const onCommand = (chatCommand: string) =>
  (source$: Observable<Command>) => {
    return source$.pipe(
      filter(({ command }) => command === chatCommand)
    );
  }

const ofEvent = (event: string) => (source$: Observable<any>) => {
  return source$.pipe(
    filter(eventData => eventData.event_type === event)
  )
}

@Injectable()
export class AlertsEffects {
  commandReceived$ = createEffect(() => this.actions$.pipe(
    ofType(TwitchActions.command, TwitchActions.broadcast),
    filter(({ command: commandInfo }) => !!alerts[commandInfo.command]),
    map(({ command }) => {
      const commandInfo = command;
      const alert = alerts[commandInfo.command];
      const user = alert.showMessage ? commandInfo.message : commandInfo.user;

      if (alert.subsOnly && !commandInfo.flags.subscriber && !commandInfo.flags.broadcaster) {
        return AlertsActions.subOnlyAlert();
      }

      return AlertsActions.commandAlert({ user, alert })
    })
  ));

  raided$ = createEffect(() => this.wsEventService.events$.pipe(
    ofEvent('raid'),
    map(event => {
      return AlertsActions.raidAlert({
        user: event.event_data.from_broadcaster_user_name,
        alert: {
          title: ` raided with ${event.event_data.viewers} viewers`,
          gif: raidGif,
          showMessage: true,
          duration: 8000,
          subsOnly: false
        }
      });
    })
  ));

  followed$ = createEffect(() =>  this.wsEventService.events$.pipe(
    ofEvent('follow'),
    map(event => {
      return AlertsActions.followAlert({
        user: event.event_data.user_name,
        alert: {
          title: '',
          gif: followGif,
          showMessage: false,
          duration: 6000,
          subsOnly: false
        }
      });
    })
  ));

  subscribed$ = createEffect(() => this.wsEventService.events$.pipe(
    ofEvent('subscribe'),
    map(event => {
      return AlertsActions.subAlert({
        user: event.event_data.data.message.user_name,
        alert: {
          title: ` subscribed!`,
          gif: subGif,
          showMessage: false,
          duration: 3000,
          subsOnly: false
        }
      });
    })
  ));

  githubStar$ = createEffect(() => this.actions$.pipe(
    ofType(GitHubActions.githubStar),
    map(action => {
      return AlertsActions.githubStarAlert({
        user: action.username,
        alert: {
          title: ``,
          gif: githubStarGif,
          showMessage: false,
          duration: 5000,
          subsOnly: false
        }
      });
    })
  ));

  showGif$ = createEffect(() => this.actions$.pipe(
    ofType(TwitchActions.broadcast),
    map(action => action.command),
    onCommand('gif'),
    concatMap(({ message }) => {
      return this.gifSearchService.search(message)
        .pipe(
          map(gifUrl => AlertsActions.gifAlert({
            text: '',
            searchTerms: message,
            gifUrl
          }))
        );
    })
  ));

  clearGif$ = createEffect(() => this.actions$.pipe(
    ofType(AlertsActions.gifAlert),
    delay(5000),
    map(() => AlertsActions.gifCleared())
  ));

  playAudioAndClearAlert$ = createEffect(() => this.actions$.pipe(
    ofType(
      AlertsActions.commandAlert,
      AlertsActions.raidAlert,
      AlertsActions.followAlert,
      AlertsActions.subAlert,
      AlertsActions.githubStarAlert
    ),
    concatMap(({ alert }) => {
      const audio = alert.audio ? alert.audio.play().catch((e) => console.warn(e)) : Promise.resolve(true);

      return from(audio).pipe(
        delay(alert.duration),
        map(() => AlertsActions.alertCleared())
      );
    })
  ));

  constructor(
    private actions$: Actions,
    private gifSearchService: GifSearchService,
    private wsEventService: WebSocketEventSerivce
  ) { }

}
