export interface Subscriber {
  title: string;
  description: string;
  channelId: string;
  thumbnails: any;
}

export interface SubscriptionModel {
  id: string;
  subscriberSnippet: Subscriber;
}
