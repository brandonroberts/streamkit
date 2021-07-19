import { createAction, props } from '@ngrx/store';

export const enter = createAction('[Messages Page] Enter');

export const messagesCleared = createAction('[Messages/API] Messages Cleared');

export const messagesLoadedSuccess = createAction(
  '[Messages/API] Messages Loaded Success',
  props<{ data: { liveChatId: string, messages: any[] } }>()
);