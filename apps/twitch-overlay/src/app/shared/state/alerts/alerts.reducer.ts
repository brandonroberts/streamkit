import { createReducer, on, createFeature } from '@ngrx/store';

import { GitHubAlertActions } from '@streamkit/github/shared/state/alerts';
import { Alert } from '@streamkit/shared/config';

import * as AlertsActions from './alerts.actions';

export interface State {
  text: string | null;
  alert: {
    user: string;
    alert: Alert;
  } | null;
  paused: boolean;
}

export const initialState: State = {
  text: null,
  paused: false,
  alert: null,
};

export const alertsFeature = createFeature({
  name: 'alerts',
  reducer: createReducer(
    initialState,
    on(
      AlertsActions.commandAlert,
      AlertsActions.commandAlert,
      AlertsActions.followAlert,
      AlertsActions.subAlert,
      GitHubAlertActions.githubStarAlert,
      (state, action) => {
        const text = `
        <h1>${action.user}${action.alert.title}</h1>
        <img src="${action.alert.gif}" />
      `;

        return {
          ...state,
          text,
          alert: {
            user: action.user,
            alert: action.alert,
          },
        };
      }
    ),
    on(AlertsActions.raidAlert, (state, action) => {
      const text = `
        <h1>${action.user}${action.alert.title}</h1>
        <video width="450" autoplay="true">
          <source src="/assets/letsgo.mp4" type="video/mp4">
        </video>
      `;

      return {
        ...state,
        text,
        alert: {
          user: action.user,
          alert: action.alert,
        },
      };
    }),
    on(AlertsActions.alertCleared, AlertsActions.gifCleared, (state) => {
      return {
        ...state,
        text: null,
        alert: null,
      };
    }),
    on(AlertsActions.gifAlert, (state, action) => {
      const text = `
        <h1>${action.searchTerms}</h1>
        <img src="${action.gifUrl}" />
      `;

      return {
        ...state,
        text,
        alert: null,
      };
    })
  ),
});

export const {
  selectText,
  selectPaused: selectIsPaused,
  selectAlert,
  selectAlertsState,
} = alertsFeature;
