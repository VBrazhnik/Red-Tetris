import parse from 'url-parse';
import decodeUriComponent from 'decode-uri-component';

const parseUrl = url => {
  const { hash } = parse(decodeUriComponent(url));
  const hashRegExp = /#(.+)\[(.+)]/;
  if (!hashRegExp.test(hash)) return {};
  const [, roomName, playerName] = hash.match(hashRegExp);
  return {
    roomName,
    playerName,
  };
};

export { parseUrl };
