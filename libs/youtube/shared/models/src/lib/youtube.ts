import { youtube_v3 } from 'googleapis';
export interface Subscriber {
  title: string;
  description: string;
  channelId: string;
  thumbnails: any;
}

export interface SubscriptionModel extends youtube_v3.Schema$Subscription { }

export interface MessageModel extends youtube_v3.Schema$LiveChatMessage { }

export interface CommandModel extends MessageModel {
  command: string;
}
