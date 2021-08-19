import { createAction, props } from '@ngrx/store';

import {
  CommandModel,
  MessageModel,
  SubscriptionModel,
} from '@streamkit/youtube/shared/models';

export const loadedMessages = createAction(
  'messages_loaded',
  props<{ data: { liveChatId: string; messages: MessageModel[] } }>()
);

export const polledMessages = createAction(
  'messages_polled',
  props<{ data: { liveChatId: string; messages: MessageModel[] } }>()
);

export const loadedSubscribers = createAction(
  'subscriptions_loaded',
  props<{ data: { subscriptions: SubscriptionModel[] } }>()
);

export const polledSubscribers = createAction(
  'subscriptions_polled',
  props<{ data: { subscriptions: SubscriptionModel[] } }>()
);

export const polledCommands = createAction(
  'commands_polled',
  props<{ data: { liveChatId: string; message: CommandModel } }>()
);
