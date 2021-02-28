import { Action, createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { collectEmoteReplacements, formatMessage, Message } from './messages.model';
import * as MessagesActions from './messages.actions';
import { TwitchActions } from '@ngtwitch/actions';

export const messagesFeatureKey = 'messages';

export interface State extends EntityState<Message> {
  // additional entities state properties
}

export const adapter: EntityAdapter<Message> = createEntityAdapter<Message>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});


export const reducer = createReducer(
  initialState,
  on(TwitchActions.message,
    (state, action) => {
     const emoteReplacements = collectEmoteReplacements(action.message);
     const formattedMessage = formatMessage(action.message, emoteReplacements);

     return adapter.addOne({ ...action.message, formattedMessage, active: true }, state);
  }),
  on(MessagesActions.messagesCleared,
    state => adapter.map(message => {
      return {
        ...message,
        active: false
      };
    }, state)
  ),
);


export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
