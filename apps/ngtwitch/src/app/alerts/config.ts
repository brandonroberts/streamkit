/* Config */
export const PAUSE_DURATION = 30 * 1000; // 30 seconds

/* Sound Effects */
export const pewAudio = new Audio("/assets/horn.wav");
export const magicChime = new Audio("/assets/Magic_Chime.mp3");

/* GIFs */
export const welcomeGif = "/assets/kawhi-laugh.gif";
export const subGif = "/assets/sub.gif";
export const raidGif = "/assets/raid.gif";
export const boilerplateGif = "/assets/boilerplate.gif";
export const followGif = '/assets/follow.gif';

export interface Alert {
  title: string;
  gif: string,
  audio?: HTMLAudioElement,
  showMessage: boolean;
  duration: number;
  subsOnly: boolean;
}

/* Alerts */
export const alerts: { [name: string]: Alert } = {
  sup: {
    title: '',
    gif: welcomeGif,
    audio: pewAudio,
    showMessage: false,
    duration: 3000,
    subsOnly: false
  },
  boilerplate: {
    title: ' wants more',
    gif: boilerplateGif,
    audio: magicChime,
    showMessage: false,
    duration: 3000,
    subsOnly: true
  }
};

export const commandResponses: { [name: string]: { response: string } } = {
  ngrx: {
    response: `
      NgRx is an open source framework for building reactive Angular applications:
      https://ngrx.io https://github.com/ngrx/platform
    `
  },
  discord: {
    response: 'Check out our discord server at: https://discord.gg/gCEj4zC'
  },
  bot: {
    response: 'I\'m a bot powered by Angular! Source: https://github.com/brandonroberts/ngtwitch'
  },
  commands: {
    response: 'Bot commands: !ngrx !discord !bot !commands'
  }
};
