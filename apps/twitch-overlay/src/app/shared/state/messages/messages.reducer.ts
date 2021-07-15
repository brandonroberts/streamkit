import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import {
  collectEmoteReplacements,
  formatMessage,
  Message,
} from './messages.model';
import * as MessagesActions from './messages.actions';
import { MessageActions, TwitchActions } from '@streamkit/shared/actions';

export const messagesFeatureKey = 'messages';

export interface State extends EntityState<Message> {
  // additional entities state properties
  pinnedMessageId: string | null;
  avatarUrls: { [name: string]: string };
}

export const adapter: EntityAdapter<Message> = createEntityAdapter<Message>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
  pinnedMessageId: null,
  avatarUrls: {},
});

export const reducer = createReducer(
  initialState,
  on(TwitchActions.message, (state, action) => {
    const emoteReplacements = collectEmoteReplacements(action.message);
    const formattedMessage = formatMessage(action.message, emoteReplacements);

    return adapter.addOne(
      { ...action.message, formattedMessage, active: true },
      state
    );
  }),
  on(MessagesActions.messageAvatarFetchedSuccess, (state, action) => {
    return {
      ...state,
      avatarUrls: {
        ...state.avatarUrls,
        [action.user]: action.avatarUrl,
      },
    };
  }),
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
  }))
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();

export const selectPinnedMessageId = (state: State) => state.pinnedMessageId;
export const selectAvatarUrls = (state: State) => state.avatarUrls;
