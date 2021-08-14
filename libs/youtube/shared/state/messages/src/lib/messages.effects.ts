import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { EMPTY } from 'rxjs';
import { catchError, exhaustMap, filter, map, mergeMap, switchMap } from 'rxjs/operators';
import randomColor from 'randomcolor';

import {
  YouTubeChatActions,
  YouTubeWebSocketActions,
} from '@streamkit/youtube/shared/actions';
import { subGif } from '@streamkit/shared/config';
import { YouTubeService } from '@streamkit/youtube/data-access-youtube';
import { AlertsActions } from '@streamkit/youtube/shared/state/alerts';

import * as MessagesActions from './messages.actions';

@Injectable()
export class MessagesEffects {
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
            mergeMap((liveChatId) =>
              this.youtubService.start(liveChatId)
                .pipe(
                  map(data => MessagesActions.messagesLoadedSuccess({ data: { liveChatId, messages: data.items } })),
                  catchError(() => EMPTY)
                )
            )
          );
        })
      );
    }
  );

  addMessages$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(YouTubeWebSocketActions.polledMessages),
      switchMap((action) => {
        const messages = action.data.messages.map((message) => {
          return YouTubeChatActions.message({
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
      ofType(YouTubeWebSocketActions.polledCommands),
      map((action) => {
        return YouTubeChatActions.command({
          liveChatId: action.data.liveChatId,
          command: {
            user: action.data.message.authorDetails.displayName,
            message: action.data.message.snippet.textMessageDetails.messageText,
            command: action.data.message.command,
            flags: { broadcaster: true } as any,
          },
        });
      })
    );
  });
  
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
    private actions$: Actions,
    private youtubService: YouTubeService,
    private router: Router
  ) { }
}
