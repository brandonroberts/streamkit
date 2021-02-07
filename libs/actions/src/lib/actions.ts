import { createAction, props } from '@ngrx/store';
import { Command, Chat, Raid, Sub } from '@ngtwitch/models';

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

export const raid = createAction(
  '[Twitch] Raided',
  props<{ raid: Raid }>()
);

export const sub = createAction(
  '[Twitch] Subscription',
  props<{ sub: Sub }>()
);

export const follow = createAction(
  '[Twitch] Follow',
  props<{ follower: string }>()
);