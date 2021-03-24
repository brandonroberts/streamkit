import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromMessages from './messages.reducer';

export const selectMessagesState = createFeatureSelector<fromMessages.State>(fromMessages.messagesFeatureKey);

export const selectAllMessages = createSelector(
  selectMessagesState,
  fromMessages.selectAll
);

export const selectAllFormattedMessages = createSelector(
  selectAllMessages,
  (allMessages) => {
    const filteredMessages = allMessages.filter(message => message.active);
    const lastTwoMessages = filteredMessages.slice(filteredMessages.length-2);

    return lastTwoMessages;
  }
);

export const selectAllMessageEntities = createSelector(
  selectMessagesState,
  fromMessages.selectEntities
);

export const selectPinnedMessageId = createSelector(
  selectMessagesState,
  fromMessages.selectPinnedMessageId
);

export const selectPinnedMessage = createSelector(
  selectAllMessageEntities,
  selectPinnedMessageId,
  (entities, messageId) => messageId ? entities[messageId] : null
);
