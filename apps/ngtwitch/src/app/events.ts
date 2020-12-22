import { OnMessageFlags } from 'comfy.js';

export interface Chat {
  user: string;
  message: string;
}

export interface Command {
  user: string;
  command: string;
  message: string;
  flags: OnMessageFlags;
}

export interface Sub {
  user: string;
  message: string
  flags: any;
}

export interface Raid {
  user: string;
  message: string;
  viewers: number;
  flags: any;
}