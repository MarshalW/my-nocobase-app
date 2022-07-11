import { EventEmitter } from 'events';

import initZhixinProvider from './zhixinProvider';
import initZhongsouProvider from './zhongsouProvider';
import initXinghuoProvider from './xinghuoProvider';

export default function () {
  const eventEmitter = new EventEmitter();

  initZhixinProvider(eventEmitter);
  initZhongsouProvider(eventEmitter);
  initXinghuoProvider(eventEmitter);

  eventEmitter.on('onChain', (nftInfo, provider) => {
    console.log({ provider });
    eventEmitter.emit(`${provider}.onChain`, nftInfo);
  });

  return eventEmitter;
}
