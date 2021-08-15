import { createAction, props } from '@ngrx/store';

export const pinMessage = createAction(
  '[Messages/WebSocket] Message Pinned',
  props<{ id: string }>()
);

export const messagePinned = createAction(
  '[Messages Page] Message Pinned',
  props<{ id: string }>()
);

export const messagePinnedSuccess = createAction(
  '[Messages/API] Message Pinned Success'
);
