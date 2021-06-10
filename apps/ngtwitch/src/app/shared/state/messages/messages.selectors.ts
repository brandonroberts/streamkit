import { createFeatureSelector, createSelector } from '@ngrx/store';

import * as fromMessages from './messages.reducer';

export const selectMessagesState = createFeatureSelector<fromMessages.State>(fromMessages.messagesFeatureKey);

export const selectMessages = createSelector(
  selectMessagesState,
  fromMessages.selectAll
);

export const selectAvatarUrlDictionary = createSelector(
  selectMessagesState,
  fromMessages.selectAvatarUrls
);

export const selectAllMessages = createSelector(
  selectMessages,
  selectAvatarUrlDictionary,
  (messages, avatarUrls) => {
    return messages.map(message => {
      return {
        ...message,
        avatarUrl: avatarUrls[message.user] || 'https://static-cdn.jtvnw.net/user-default-pictures-uv/ebb84563-db81-4b9c-8940-64ed33ccfc7b-profile_image-300x300.png'
      };
    });
  }
)

export const selectAllFormattedMessages = createSelector(
  selectMessages,
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

