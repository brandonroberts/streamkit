import { EmoteSet, OnMessageFlags } from 'comfy.js';

export interface Chat {
  id: string;
  user: string;
  userColor: string;
  message: string;
  emotes?: EmoteSet;
}

export interface Command {
  user: string;
  command: string;
  message: string;
  flags: OnMessageFlags;
}

export interface Sub {
  user: string;
  message: string;
  flags: any;
}

export interface Raid {
  user: string;
  message: string;
  viewers: number;
  flags: any;
}

export interface FollowerInfo {
  from_id: string;
  from_name: string;
  to_id: string;
  to_name: string;
  followed_at: string;
}

export interface FollowEvent {
  data: FollowerInfo[];
}
