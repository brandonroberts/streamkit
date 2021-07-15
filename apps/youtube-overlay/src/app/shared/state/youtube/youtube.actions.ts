import { createAction, props } from "@ngrx/store";
import { Command } from "@streamkit/models";

import { Message } from "../messages/messages.model";

export const message = createAction(
  '[YouTube] Chat Message',
  props<{ liveChatId: string, message: Message }>()
);

export const command = createAction(
  '[YouTube] Chat Command',
  props<{ liveChatId: string, command: Command }>()
);
