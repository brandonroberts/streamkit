import { createAction, props } from '@ngrx/store';

export const enter = createAction('[Messages Page] Enter');

export const messagesCleared = createAction(
  '[Messages/API] Messages Cleared'
);
