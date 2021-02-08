import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';

import { concatMap, delay, filter, map } from 'rxjs/operators';
import { from, Observable } from 'rxjs';

import { GitHubActions, TwitchActions } from '@ngtwitch/actions';
import { Command } from '@ngtwitch/models';

import { alerts, followGif, githubStarGif, raidGif, subGif } from '../../../config';
import { GifSearchService } from '../../../gif-search.service';
import * as AlertsActions from './alerts.actions';

const onCommand = (chatCommand: string) =>
  (source$: Observable<Command>) => {
    return source$.pipe(
      filter(({ command }) => command === chatCommand)
    );
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

  raided$ = createEffect(() => this.actions$.pipe(
    ofType(TwitchActions.raid),
    map(action => {
      return AlertsActions.raidAlert({
        user: action.raid.user,
        alert: {
          title: action.raid.message,
          gif: raidGif,
          showMessage: true,
          duration: 3000,
          subsOnly: false
        }
      });
    })
  ));

  followed$ = createEffect(() => this.actions$.pipe(
    ofType(TwitchActions.follow),
    map(action => {
      return AlertsActions.followAlert({
        user: action.follower,
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

  subscribed$ = createEffect(() => this.actions$.pipe(
    ofType(TwitchActions.sub),
    map(action => {
      return AlertsActions.subAlert({
        user: action.sub.user,
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
    private gifSearchService: GifSearchService
  ) { }

}
