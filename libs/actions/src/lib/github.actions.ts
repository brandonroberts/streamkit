import { createAction, props } from '@ngrx/store';

export const githubStar = createAction(
  '[GitHub/Webhook] Repo Star',
  props<{ username: string }>()
);
