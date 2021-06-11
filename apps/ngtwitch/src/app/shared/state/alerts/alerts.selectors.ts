import * as fromAlerts from './alerts.reducer';

export const selectAlertsState = fromAlerts.selectAlertsState;

export const selectCurrentAlert = fromAlerts.selectAlert;

export const selectCurrentText = fromAlerts.selectText;

export const selectAlertsPaused = fromAlerts.selectIsPaused;