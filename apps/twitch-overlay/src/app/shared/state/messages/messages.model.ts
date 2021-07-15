import { Chat } from '@streamkit/twitch/shared/models';

export interface Message extends Chat {
  active: boolean;
  formattedMessage: string;
  avatarUrl?: string;
}

export interface EmoteReplacement {
  id: string;
  start: string;
  end: string;
  url: string;
}
/**
 * Emotes are included in the message, that should
 * be translated to an Image URL
 * https://static-cdn.jtvnw.net/emoticons/v2/{ID}/default/{light|dark}/{1.0|2.0|3.0}
 * 
 * Sample message
      '5866ae00-b586-44f5-9506-e3acd675c2e0': {
        id: '5866ae00-b586-44f5-9506-e3acd675c2e0',
        user: 'nicotugz',
        message: 'Brandon is like NotLikeThis',
        emotes: {
          '58765': [
            '16-26'
          ]
        }
      }
 */

export function collectEmoteReplacements(message: Chat) {
  const emotesUrls: EmoteReplacement[] = [];
  const emotes = message.emotes || [];

  Object.keys(emotes).forEach((id) => {
    message.emotes[id].forEach((replacements: string) => {
      const [start, end] = replacements.split('-');
      const emoteUrl = `https://static-cdn.jtvnw.net/emoticons/v2/${id}/default/dark/3.0`;

      emotesUrls.push({
        id,
        start,
        end,
        url: emoteUrl,
      });
    });
  });

  emotesUrls.sort((a, b) =>
    parseInt(b.start, 10) > parseInt(a.start, 10) ? 1 : -1
  );

  return emotesUrls;
}

export function formatMessage(message: Chat, emotesUrls: EmoteReplacement[]) {
  let formattedMessage = message.message;
  // console.log(emotesUrls);

  emotesUrls.forEach((emoteUrl) => {
    const emoteImg = `<img src="${emoteUrl.url}" width="24px" height="24px">`;

    const start = `${formattedMessage.substring(0, +emoteUrl.start)}`;
    const end = `${formattedMessage.substring(+emoteUrl.end + 1)}`;

    formattedMessage = `${start}${emoteImg}${end}`;
  });

  return formattedMessage;
}
