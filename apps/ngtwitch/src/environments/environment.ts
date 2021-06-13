// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  authHost: 'http://localhost:4200',
  apiHost: 'http://localhost:4200',
  wsHost: 'ws://localhost:3333',
  wsToken: '315b4072ba698667a08e09062dfd85ef82e310ca',
  giphyApiKey: '',
  tauWs: 'ws://localhost:8000/ws/twitch-events/'
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
