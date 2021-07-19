import { createAction, props } from '@ngrx/store';

import { ChatAlert } from '@streamkit/shared/models';

export const githubStarAlert = createAction(
  '[Alerts] GitHub Star',
  props<ChatAlert>()
);

export const githubStar = createAction(
  '[GitHub/Webhook] Repo Star',
  props<{ username: string }>()
);
