import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromSubscription from './subscription.reducer';

export const selectSubscriptionState = createFeatureSelector<fromSubscription.State>(
  fromSubscription.subscriptionsFeatureKey
);
