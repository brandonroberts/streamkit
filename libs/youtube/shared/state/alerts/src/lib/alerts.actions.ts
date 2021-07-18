import { createAction, props } from '@ngrx/store';

import { Alert } from '@streamkit/youtube/shared/config';

export interface ChatAlert {
  user: string;
  alert: Alert;
}

export const pageEnter = createAction('[Alerts Page] Enter');

export const commandAlert = createAction(
  '[Alerts] Command Alert',
  props<ChatAlert>()
);

export const followAlert = createAction(
  '[Alerts] Follow Alert',
  props<ChatAlert>()
);

export const subAlert = createAction('[Alerts] Sub Alert', props<ChatAlert>());

export const gifAlert = createAction(
  '[Alerts] Gif Alert',
  props<{ text: string; searchTerms: string; gifUrl: string }>()
);

export const githubStarAlert = createAction(
  '[Alerts] GitHub Star',
  props<ChatAlert>()
);

export const subOnlyAlert = createAction('[Twitch] Sub-Only Command');

export const alertCleared = createAction('[Alerts] Alert Cleared');

export const gifCleared = createAction('[Alerts] Gif Cleared');
