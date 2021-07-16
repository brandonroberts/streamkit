import { Injectable } from '@angular/core';
import { Actions, concatLatestFrom, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { TwitchActions } from '@streamkit/twitch/shared/actions';

import * as MessagesActions from './messages.actions';
import {
  catchError,
  concatMap,
  delay,
  filter,
  map,
  switchMap,
} from 'rxjs/operators';
import { TwitchService } from '../../../twitch.service';
import { selectAvatarUrlDictionary } from './messages.selectors';
import { Store } from '@ngrx/store';

@Injectable()
export class MessagesEffects {
  fetchAvatar$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TwitchActions.message),
      concatLatestFrom(() => this.store.select(selectAvatarUrlDictionary)),
      filter(
        ([action, avatarUrlsDictionary]) =>
          !avatarUrlsDictionary[action.message.user]
      ),
      concatMap(([action]) => {
        return this.twitchService.getUserProfileUrl(action.message.user).pipe(
          map((profileImageUrl) =>
            MessagesActions.messageAvatarFetchedSuccess({
              user: action.message.user,
              avatarUrl: profileImageUrl,
            })
          ),
          catchError(() => of(MessagesActions.messageAvatarFetchedFailure()))
        );
      })
    );
  });

  clearMessages$ = createEffect(
    () => {
      return this.actions$.pipe(
        ofType(TwitchActions.message),
        switchMap(() =>
          of(null).pipe(
            delay(15000),
            map(() => MessagesActions.messagesCleared())
          )
        )
      );
    },
    { dispatch: false }
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private twitchService: TwitchService
  ) {}
}
