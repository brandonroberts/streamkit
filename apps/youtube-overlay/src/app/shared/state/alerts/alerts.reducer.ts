import { createReducer, on } from '@ngrx/store';

import { Alert } from '../../../config';
import * as AlertsActions from './alerts.actions';

export const alertsFeatureKey = 'alerts';

export interface State {
  text: string | null;
  alert?: {
    user: string;
    alert: Alert;
  };
  paused: boolean;
}

export const initialState: State = {
  text: null,
  paused: false,
};

export const reducer = createReducer(
  initialState,
  on(
    AlertsActions.commandAlert,
    AlertsActions.commandAlert,
    AlertsActions.raidAlert,
    AlertsActions.followAlert,
    AlertsActions.subAlert,
    AlertsActions.githubStarAlert,
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
);

export const selectText = (state: State) => state.text;
export const selectAlert = (state: State) => state.alert;
export const selectIsPaused = (state: State) => state.paused;
