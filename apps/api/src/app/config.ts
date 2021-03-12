export const commandResponses: { [name: string]: { response: string, restricted?: boolean } } = {
  ngrx: {
    response: `
      NgRx is an open source framework for building reactive Angular applications:
      https://ngrx.io https://github.com/ngrx/platform
    `
  },
  discord: {
    response: 'Check out our NgRx discord server at: https://discord.gg/ngrx'
  },
  bot: {
    response: 'I\'m a bot powered by Angular! Source: https://github.com/brandonroberts/ngtwitch'
  },
  support: {
    response: `You can support my channel by subscribing for free with Amazon Prime, learn more at 
    https://twitch.amazon.com/tp!
    You can also sponsor me on GitHub! https://github.com/sponsors/brandonroberts
    `,
    restricted: true
  },
  so: {
    response: `Shoutout to {{message}} and follow their channel at https://twitch.tv/{{message}}!`,
    restricted: true
  },
  commands: {
    response: 'Bot commands: !ngrx !discord !bot !support !commands'
  }
};
