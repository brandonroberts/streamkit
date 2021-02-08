import { createAction, props } from "@ngrx/store";

export const authCallbackEnter = createAction(
  '[Auth Callback Page] Enter',
  props<{ token: string; clientId: string }>()
);

export const authSuccess = createAction(
  '[Auth/API] Authentication Success',
  props<{ data: any[], headers: any }>()
);

export const followSubscribeSuccess = createAction('[Twitch/API] Follow Subscription Success');
