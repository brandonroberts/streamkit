import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { YouTubeWebSocketActions } from '@streamkit/youtube/shared/actions';
import { SubscriptionModel } from '@streamkit/youtube/shared/models';

export const subscriptionsFeatureKey = 'subscriptions';

export interface State extends EntityState<SubscriptionModel> {
  // additional entities state properties
}

export const adapter: EntityAdapter<SubscriptionModel> = createEntityAdapter<SubscriptionModel>();

export const initialState: State = adapter.getInitialState({
  // additional entity state properties
});

export const reducer = createReducer(
  initialState,
  on(YouTubeWebSocketActions.loadedSubscribers, (state, action) =>
    adapter.setAll(action.data.subscriptions, state)
  ),
  on(YouTubeWebSocketActions.polledSubscribers, (state, action) =>
    adapter.upsertMany(action.data.subscriptions, state)
  )
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
