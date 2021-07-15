import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { SharedActions, createEffect, ofType } from '@ngrx/effects';
import { exhaustMap, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import randomColor from 'randomcolor';

import { YouTubeActions as YouTubeWebSocketActions } from '@streamkit/shared/actions';

import { subGif } from '../../../config';
import { AlertsActions } from '../alerts';
import { MessagesActions } from '../messages';
import * as YouTubeActions from './youtube.actions';
import { YouTubeService } from './youtube.service';

@Injectable()
export class YouTubeEffects {
  startPolling$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(MessagesActions.enter),
        exhaustMap(() => {
          return this.youtubService.getBroadcasts().pipe(
            filter((total) => total.length > 0),
            map((broadcasts) => {
              return (
                this.router.routerState.snapshot.root.queryParamMap.get(
                  'liveChatId'
                ) || broadcasts[0].snippet.liveChatId
              );
            }),
            mergeMap((liveChatId) => this.youtubService.start(liveChatId))
          );
        })
      );
    },
    { dispatch: false }
  );

  addMessages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(YouTubeWebSocketActions.polledMessages),
      switchMap((action) => {
        const messages = action.data.messages.map((message) => {
          return YouTubeActions.message({
            liveChatId: action.data.liveChatId,
            message: {
              id: message.id,
              message: message.snippet.textMessageDetails.messageText,
              formattedMessage: message.snippet.textMessageDetails.messageText,
              user: message.authorDetails.displayName,
              userColor: randomColor(),
              avatarUrl: message.authorDetails.profileImageUrl,
              active: true,
            },
          });
        });

        return messages;
      })
    );
  });

  sendCommand$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(AlertsActions.pageEnter),
      switchMap(() =>
        this.actions$.pipe(
          ofType(YouTubeActions.message),
          filter((action) => action.message.message.startsWith('!')),
          map((action) => {
            const command = action.message.message.split(' ')[0].substring(1);
            const message = action.message.message.substring(
              `!${command}`.length
            );

            return YouTubeActions.command({
              liveChatId: action.liveChatId,
              command: {
                user: action.message.user,
                message,
                command,
                flags: { broadcaster: true } as any,
              },
            });
          })
        )
      )
    );
  });

  responseToNgRxCommand$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(YouTubeActions.command),
        filter(
          (action) =>
            action.command.command === 'ngrx' &&
            this.router.routerState.snapshot.root.queryParamMap.get(
              'respond'
            ) === 'true'
        ),
        switchMap((action) => {
          let message = 'NgRx is an open source framework for building ';
          message += 'reactive Angular applications ';
          message += 'https://ngrx.io https://github.com/ngrx/platform';

          return this.youtubService.postMessage(action.liveChatId, message);
        })
      );
    },
    { dispatch: false }
  );

  subscribed$ = createEffect(() =>
    this.actions$.pipe(
      ofType(YouTubeWebSocketActions.polledSubscribers),
      switchMap((action) => {
        return action.data.subscriptions.map((subscription) => {
          return AlertsActions.subAlert({
            user: subscription.subscriberSnippet.title,
            alert: {
              title: ` subscribed!`,
              gif: subGif,
              showMessage: false,
              duration: 3000,
              subsOnly: false,
            },
          });
        });
      })
    )
  );

  constructor(
    private actions$: SharedActions,
    private youtubService: YouTubeService,
    private router: Router
  ) {}
}
