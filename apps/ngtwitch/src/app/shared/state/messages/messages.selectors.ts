import { createFeatureSelector, createSelector } from '@ngrx/store';

import { EmoteReplacement } from './messages.model';
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
