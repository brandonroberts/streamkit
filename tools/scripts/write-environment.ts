const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const { cwd } = require('process');

dotenv.config();
const environmentProdPath = path.join(
  cwd(),
  'apps/twitch-overlay/src/environments/environment.prod.ts'
);

const envKeys = {
  apiHost: 'API_HOST',
  authHost: 'AUTH_HOST',
  wsHost: 'WS_HOST',
  wsToken: 'WS_TOKEN',
  giphyApiKey: 'GIPHY_API_KEY',
  tauWs: 'TAU_WS',
};

const envValues = { production: true };
Object.keys(envKeys).forEach((key) => {
  envValues[key] = process.env[envKeys[key]];
});

const environmentProdString = `
export const environment = ${JSON.stringify(envValues)};
`;

fs.writeFileSync(environmentProdPath, environmentProdString);
