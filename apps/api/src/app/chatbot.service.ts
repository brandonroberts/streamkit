import { Injectable } from '@nestjs/common';

import ComfyJS, { OnMessageFlags } from 'comfy.js';
import { Subject } from 'rxjs';
import { filter, map } from 'rxjs/operators';

import { Command, Sub, Raid, Chat, FollowerInfo, FollowEvent } from '@ngtwitch/models';
import { TwitchActions } from '@ngtwitch/actions';

@Injectable()
export class ChatBotService {
  private _command$ = new Subject<Command>();
  private _raid$ = new Subject<Raid>();
  private _sub$ = new Subject<Sub>();
  private _chat$ = new Subject<Chat>();
  private _follow$ = new Subject<FollowerInfo>();

  command$ = this._command$.pipe(map(command => TwitchActions.command({ command })));
  broadcast$ = this._command$.pipe(filter(({ flags }) => flags.broadcaster));
  chat$ = this._chat$.pipe(map(message => TwitchActions.message({ message })));
  raid$ = this._raid$.pipe(map(raid => TwitchActions.raid({ raid })));
  subs$ = this._sub$.pipe(map(sub => TwitchActions.sub({ sub })));
  follows$ = this._follow$.pipe(map(follower => TwitchActions.follow({ follower: follower.from_name })));

  init() {
    ComfyJS.Init(process.env.twitchTvHandle, process.env.chatbotOauthKey, ['brandontroberts']);

    this.setupCommandListener();
    this.setupChatListener();
    this.setupRaidListener();
    this.setupSubListener();
  }

  setupCommandListener() {
    ComfyJS.onCommand = (user, command, message, flags) => {
      this._command$.next({
        user,
        command,
        message,
        flags
      }
      );
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

  sendFollow(followEvent: FollowEvent) {
    followEvent.data.forEach(followerInfo => {
      this._follow$.next(followerInfo);
    })
  }


  respond(message: string) {
    ComfyJS.Say(message, undefined);
  }
}
