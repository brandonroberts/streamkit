import { createAction, props } from '@ngrx/store';

export const pinMessage = createAction(
  '[Messages/API] Pin Message',
  props<{ id: string }>()
);
