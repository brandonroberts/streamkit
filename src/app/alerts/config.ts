/* Sound Effects */
export const pewAudio = new Audio("/assets/horn.wav");
export const magicChime = new Audio("/assets/Magic_Chime.mp3");

/* GIFs */
export const beyGif = "https://media.giphy.com/media/VxkNDa92gcsRq/giphy.gif";
export const welcomeGif = "https://media.giphy.com/media/l3V0doGbp2EDaLHJC/giphy.gif";
export const pizzaGif = "https://media.giphy.com/media/3o6nUXaNE4wdhq8Foc/giphy.gif";

export interface Alert {
  title: string;
  gif: string,
  audio: HTMLAudioElement,
  showMessage: boolean;
  duration: number;
}

/* Alerts */
export const alerts: { [name: string]: Alert } = {
  yo: {
    title: ' is hype!',
    gif: beyGif,
    audio: pewAudio,
    showMessage: false,
    duration: 10000,
  },
  welcome: {
    title: ' needs a welcome!',
    gif: welcomeGif,
    audio: magicChime,
    showMessage: true,
    duration: 5000
  },
  pizza: {
    title: ' needed a pizza party!',
    gif: pizzaGif,
    audio: magicChime,
    showMessage: true,
    duration: 5000
  }
};
