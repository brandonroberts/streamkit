import { createSelector } from '@ngrx/store';

import { MessagesSelectors } from '@streamkit/youtube/shared/state/messages';

export const selectMessagesViewModel = createSelector(
  MessagesSelectors.selectAllFormattedMessages,
  MessagesSelectors.selectPinnedMessageId,
  (messages, pinnedMessageId) => ({
    messages: messages.map(message => {
      return {
        ...message,
        pinned: pinnedMessageId === message.id
      }
    }),
    pinnedMessageId
  })
);
