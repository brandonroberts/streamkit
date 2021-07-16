import { Chat } from '@streamkit/shared/models';

export interface Message extends Chat {
  active: boolean;
  formattedMessage: string;
  avatarUrl?: string;
}
