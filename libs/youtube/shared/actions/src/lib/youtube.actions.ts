import { createAction, props } from '@ngrx/store';

import { SubscriptionModel } from '@streamkit/youtube/shared/models';

export const loadedMessages = createAction(
  'messages_loaded',
  props<{ data: { liveChatId: string; messages: any[] } }>()
);

export const polledMessages = createAction(
  'messages_polled',
  props<{ data: { liveChatId: string; messages: any[] } }>()
);

export const loadedSubscribers = createAction(
  'subscriptions_loaded',
  props<{ data: { subscriptions: SubscriptionModel[] } }>()
);

export const polledSubscribers = createAction(
  'subscriptions_polled',
  props<{ data: { subscriptions: SubscriptionModel[] } }>()
);
