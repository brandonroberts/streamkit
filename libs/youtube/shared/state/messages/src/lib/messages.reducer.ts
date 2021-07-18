import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import randomColor from 'randomcolor';

import { MessageActions } from '@streamkit/shared/actions';
import {
  YouTubeChatActions,
  YouTubeWebSocketActions,
} from '@streamkit/youtube/shared/actions';
import { Message } from '@streamkit/youtube/shared/models';

import * as MessagesActions from './messages.actions';

export const messagesFeatureKey = 'messages';

export interface State extends EntityState<Message> {
  // additional entities state properties
  pinnedMessageId: string | null;
}

export const adapter: EntityAdapter<Message> = createEntityAdapter<Message>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  pinnedMessageId: null,
});

export const reducer = createReducer(
  initialState,
  on(MessagesActions.messagesCleared, (state) =>
    adapter.map((message) => {
      return {
        ...message,
        active: false,
      };
    }, state)
  ),
  on(MessageActions.pinMessage, (state, action) => ({
    ...state,
    pinnedMessageId: action.id,
  })),
  on(YouTubeWebSocketActions.loadedMessages, (state, action) => {
    return adapter.setAll(
      (action.data.messages || []).map((message) => {
        return {
          id: message.id,
          message: message.snippet.textMessageDetails.messageText,
          formattedMessage: message.snippet.textMessageDetails.messageText,
          user: message.authorDetails.displayName,
          userColor: randomColor(),
          avatarUrl: message.authorDetails.profileImageUrl,
          active: true,
        };
      }),
      state
    );
  }),
  on(YouTubeChatActions.message, (state, action) => {
    return adapter.upsertOne(action.message, state);
  })
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const selectPinnedMessageId = (state: State) => state.pinnedMessageId;
