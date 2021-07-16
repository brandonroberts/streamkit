import { Chat } from '@streamkit/twitch/shared/models';

export interface Message extends Chat {
  active: boolean;
  formattedMessage: string;
  avatarUrl?: string;
}
