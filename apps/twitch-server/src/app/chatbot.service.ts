import { Injectable } from '@nestjs/common';

import ComfyJS from 'comfy.js';
import { merge, Subject } from 'rxjs';
import { filter, map, tap } from 'rxjs/operators';
import uuid from 'uuid';
import WebSocket from 'ws';

import { Command, Chat } from '@ngtwitch/models';
import { GitHubActions, TwitchActions } from '@ngtwitch/actions';

import { commandResponses } from './config';

@Injectable()
export class ChatBotService {
  private _command$ = new Subject<Command>();
  private _chat$ = new Subject<Chat>();
  private _githubStar$ = new Subject<string>();

  command$ = this._command$.pipe(
    filter(({ flags }) => !flags.broadcaster),
    map((command) => TwitchActions.command({ command }))
  );
  broadcast$ = this._command$.pipe(
    filter(({ flags }) => flags.broadcaster),
    map((command) => TwitchActions.broadcast({ command }))
  );
  chat$ = this._chat$.pipe(
    map((message) => TwitchActions.message({ message }))
  );
  githubStar$ = this._githubStar$.pipe(
    map((username) => GitHubActions.githubStar({ username }))
  );

  responder$ = this._command$.pipe(
    filter((incomingCommand) => !!commandResponses[incomingCommand.command]),
    tap((commandInfo) => {
      const responseInfo = commandResponses[commandInfo.command];

      let message = `${responseInfo.response}`;

      if (responseInfo.response.includes('{{message}}')) {
        message = message.replace(/{{message}}/g, commandInfo.message);
      }

      if (
        !responseInfo.restricted ||
        (responseInfo.restricted &&
          (commandInfo.flags.broadcaster || commandInfo.flags.mod))
      ) {
        this.respond(message);
      }
    })
  );

  events$ = merge(this.command$, this.broadcast$, this.chat$, this.githubStar$);

  init() {
    ComfyJS.Init(process.env.TWITCH_HANDLE, process.env.CHATBOT_OAUTH_KEY, [
      'brandontroberts',
    ]);

    this.setupCommandListener();
    this.setupResponseListener();
    this.setupChatListener();
    this.setupFollowListener();
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
        flags,
      });
    };
  }

  setupChatListener() {
    ComfyJS.onChat = (user, message, flags, self, extra) => {
      this._chat$.next({
        id: extra.id || uuid(),
        user,
        userColor: extra.userColor,
        message,
        emotes: extra.messageEmotes,
      });
    };
  }

  setupFollowListener() {
    const ws = new WebSocket(process.env.TAU_WS);

    ws.on('open', function open() {
      ws.send(JSON.stringify({ token: process.env.WS_TOKEN }));
    });

    ws.on('message', (data) => {
      const eventData = JSON.parse(data);

      if (eventData.origin === 'replay' || eventData.origin === 'test') {
        return;
      }

      switch (eventData.event_type) {
        case 'follow': {
          this.sendFollow(eventData.event_data.user_name);
        }
      }
    });
  }

  sendFollow(follower: string) {
    this.respond(`Thanks for the follow ${follower}!`);
  }

  sendGitHubStar(username: string) {
    this._githubStar$.next(username);
  }

  respond(message: string) {
    ComfyJS.Say(message, undefined);
  }
}
