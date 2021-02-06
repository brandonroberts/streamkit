import { Injectable } from '@angular/core';

import ComfyJS, { OnMessageFlags } from 'comfy.js';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { AppConfigService } from './app-config.service';
import { Command, Sub, Raid, Chat } from './events';

@Injectable({
  providedIn: 'root'
})
export class ChatBotService {
  private _command$ = new Subject<Command>();
  private _raid$ = new Subject<Raid>();
  private _sub$ = new Subject<Sub>();
  private _chat$ = new Subject<Chat>();

  command$ = this._command$.asObservable();
  broadcast$ = this._command$.pipe(filter(({ flags }) => flags.broadcaster));
  chat$ = this._chat$.asObservable();
  raid$ = this._raid$.asObservable();
  subs$ = this._sub$.asObservable();

  follows$ = this._chat$.pipe(
    filter(({ user, message }) => {
      return user === this.appConfig.twitchTvHandle && message.startsWith('Thanks for the follow');
    }),
    map(({ message }) => {
      const followerInfo = message.match(/the follow (.*?)!$/);
      return followerInfo ? followerInfo[1] : '';
    })
  );
  private appConfig = this.appConfigService.get();

  constructor(private appConfigService: AppConfigService) {}

  init() {
    ComfyJS.Init(this.appConfig.twitchTvHandle, this.appConfig.chatbotOauthKey, ['brandontroberts']);

    this.setupCommandListener();
    this.setupChatListener();
    this.setupRaidListener();
    this.setupSubListener();
  }

  setupCommandListener() {
    ComfyJS.onCommand = (user, command, message, flags) => {
      console.log(`!${command} was typed in chat`);

      this._command$.next({
        user,
        command,
        message,
        flags
      });
    };
  }

  setupChatListener() {
    ComfyJS.onChat = (user, message) => {
      console.log(user + ":", message);
      this._chat$.next({ user, message });
    };
  }

  setupSubListener() {
    ComfyJS.onSub = (user) => {
      this._sub$.next({
        user,
        message: `${user} subscribed!`,
        flags: { subscriber: true } as OnMessageFlags
      });
    }
  }

  setupRaidListener() {
    ComfyJS.onRaid = (user, viewers) => {
      this._raid$.next({
        user,
        message: `${user} raided with ${viewers} viewers`,
        viewers,
        flags: { broadcaster: true } as OnMessageFlags
      });
    }
  }

  respond(message: string) {
    ComfyJS.Say(message, undefined);
  }
}
