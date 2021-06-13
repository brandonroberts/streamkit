import { createAction, props } from '@ngrx/store';

export const messagesCleared = createAction('[Messages/API] Messages Cleared');

export const messageAvatarFetchedSuccess = createAction(
  '[Twitch/API] Avatar Fetched Success',
  props<{ user: string; avatarUrl: string }>()
);

export const messageAvatarFetchedFailure = createAction(
  '[Twitch/API] Avatar Fetched Failure'
);
