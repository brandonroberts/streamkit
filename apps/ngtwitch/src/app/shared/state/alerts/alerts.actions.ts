import { createAction, props } from '@ngrx/store';
import { Alert } from '../../../config';

interface ChatAlert {
  user: string;
  alert: Alert;
}

export const commandAlert = createAction(
  '[Alerts] Command Alert',
  props<ChatAlert>()
);

export const raidAlert = createAction(
  '[Alerts] Raid Alert',
  props<ChatAlert>()
);

export const followAlert = createAction(
  '[Alerts] Follow Alert',
  props<ChatAlert>()
);

export const subAlert = createAction(
  '[Alerts] Sub Alert',
  props<ChatAlert>()
);

export const gifAlert = createAction(
  '[Alerts] Gif Alert',
  props<{ text: string, searchTerms: string; gifUrl: string }>()
);

export const alertCleared = createAction('[Alerts] Alert Cleared');

export const gifCleared = createAction('[Alerts] Gif Cleared');
