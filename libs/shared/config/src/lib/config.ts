/* Config */
export const PAUSE_DURATION = 30 * 1000; // 30 seconds

/* Sound Effects */
export const pewAudio = new Audio('/assets/horn.wav');
export const magicChime = new Audio('/assets/Magic_Chime.mp3');

/* GIFs */
export const welcomeGif = '/assets/kawhi-laugh.gif';
export const subGif = '/assets/sub.gif';
export const raidGif = '/assets/raid.gif';
export const boilerplateGif = '/assets/boilerplate.gif';
export const followGif = '/assets/follow.gif';
export const githubStarGif = '/assets/octocat.gif';

export interface Alert {
  title: string;
  gif: string;
  audio?: HTMLAudioElement;
  showMessage: boolean;
  duration: number;
  subsOnly: boolean;
}

/* Alerts */
export const alerts: { [name: string]: Alert } = {
  sup: {
    title: '',
    gif: welcomeGif,
    showMessage: false,
    duration: 3000,
    subsOnly: false,
  },
  boilerplate: {
    title: '',
    gif: boilerplateGif,
    showMessage: true,
    duration: 5000,
    subsOnly: true,
  },
};
