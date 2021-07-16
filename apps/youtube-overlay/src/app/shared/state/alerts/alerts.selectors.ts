import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromAlerts from './alerts.reducer';

export const selectAlertsState = createFeatureSelector<fromAlerts.State>(
  fromAlerts.alertsFeatureKey
);

export const selectCurrentAlert = createSelector(
  selectAlertsState,
  fromAlerts.selectAlert
);

export const selectCurrentText = createSelector(
  selectAlertsState,
  fromAlerts.selectText
);

export const selectAlertsPaused = createSelector(
  selectAlertsState,
  fromAlerts.selectIsPaused
);
