import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { YouTubeActions } from '@streamkit/shared/actions';
import { SubscriptionModel } from '@streamkit/twitch/shared/models';

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
  on(YouTubeActions.loadedSubscribers, (state, action) =>
    adapter.setAll(action.data.subscriptions, state)
  ),
  on(YouTubeActions.polledSubscribers, (state, action) =>
    adapter.upsertMany(action.data.subscriptions, state)
  )
);

export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
