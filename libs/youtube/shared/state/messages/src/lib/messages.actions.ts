import { createAction, props } from '@ngrx/store';

import { MessageModel } from '@streamkit/youtube/shared/models';

export const enter = createAction('[Messages Page] Enter');

export const enterDashboardPage = createAction('[Dashboard Messages Page] Enter');

export const pinnedMessageEnter = createAction('[Pinned Message Page] Enter');

export const messagesCleared = createAction('[Messages/API] Messages Cleared');

export const messagesLoadedSuccess = createAction(
  '[Messages/API] Messages Loaded Success',
  props<{ data: { liveChatId: string, messages: MessageModel[] } }>()
);

export const pollingStarted = createAction(
  '[Dashboard Page] Polling Started'
);

export const pollingStartedSuccess = createAction(
  '[Dashboard Page] Polling Started Success'
);

export const pollingStartedFailure = createAction(
  '[Dashboard Page] Polling Started Failure'
);

export const pollingStopped = createAction(
  '[Dashboard Page] Polling Stopped'
);

export const pollingStoppedSuccess = createAction(
  '[Dashboard Page] Polling Stopped Success'
);

export const pollingStoppedFailure = createAction(
  '[Dashboard Page] Polling Stopped Failure'
);