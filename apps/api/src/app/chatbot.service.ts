import { Injectable } from '@nestjs/common';

import ComfyJS, { OnMessageFlags } from 'comfy.js';
import { merge, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';

import { Command, Sub, Raid, Chat, FollowerInfo, FollowEvent } from '@ngtwitch/models';
import { GitHubActions, TwitchActions } from '@ngtwitch/actions';

import { commandResponses } from './config';

@Injectable()
export class ChatBotService {
  private _command$ = new Subject<Command>();
  private _raid$ = new Subject<Raid>();
  private _sub$ = new Subject<Sub>();
  private _chat$ = new Subject<Chat>();
  private _follow$ = new Subject<FollowerInfo>();
  private _githubStar$ = new Subject<string>();

  command$ = this._command$.pipe(
    filter(({ flags }) => !flags.broadcaster),
    map(command => TwitchActions.command({ command }))
  );
  broadcast$ = this._command$.pipe(
    filter(({ flags }) => flags.broadcaster),
    map(command => TwitchActions.broadcast({ command }))
  );
  chat$ = this._chat$.pipe(map(message => TwitchActions.message({ message })));
  raid$ = this._raid$.pipe(map(raid => TwitchActions.raid({ raid })));
  subs$ = this._sub$.pipe(map(sub => TwitchActions.sub({ sub })));
  follows$ = this._follow$.pipe(map(follower => TwitchActions.follow({ follower: follower.from_name })));
  githubStar$ = this._githubStar$.pipe(map(username => GitHubActions.githubStar({username})));

  responder$ = this._command$.pipe(
    filter(incomingCommand => !!commandResponses[incomingCommand.command]),
    tap(commandInfo => {
      const responseInfo = commandResponses[commandInfo.command];

      let message = `${responseInfo.response}`;

      if (responseInfo.response.includes('{{message}}')) {
        message = message.replace('{{message}}', commandInfo.message.substr(1));
      }

      if (responseInfo.response.includes('~message~')) {
        message = message.replace('~message~', commandInfo.message);
      }

      if (!responseInfo.restricted || (responseInfo.restricted && (commandInfo.flags.broadcaster || commandInfo.flags.mod))) {
        this.respond(message);
      }
    })
  );

  events$ = merge(
    this.command$,
    this.broadcast$,
    this.chat$,
    this.raid$,
    this.subs$,
    this.follows$,
    this.githubStar$
  );

  init() {
    ComfyJS.Init(process.env.TWITCH_HANDLE, process.env.CHATBOT_OAUTH_KEY, ['brandontroberts']);

    this.setupCommandListener();
    this.setupResponseListener();
    this.setupChatListener();
    this.setupRaidListener();
    this.setupSubListener();
  }

  setupResponseListener() {
    this.responder$.subscribe();
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
    ComfyJS.onChat = (user, message, flags, self, extra) => {
      console.log(extra);
      this._chat$.next({
        id: extra.id,
        user,
        userColor: extra.userColor,
        message,
        emotes: extra.messageEmotes
      });
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

  sendGitHubStar(username: string) {
    this._githubStar$.next(username);
  }

  respond(message: string) {
    ComfyJS.Say(message, undefined);
  }
}
