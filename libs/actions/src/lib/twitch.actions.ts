import { createAction, props } from '@ngrx/store';
import { Chat, Command } from '@streamkit/models';

export const command = createAction(
  '[Twitch] Chat Command',
  props<{ command: Command }>()
);

export const broadcast = createAction(
  '[Twitch] Broadcaster Command',
  props<{ command: Command }>()
);

export const message = createAction(
  '[Twitch] Chat Message',
  props<{ message: Chat }>()
);
