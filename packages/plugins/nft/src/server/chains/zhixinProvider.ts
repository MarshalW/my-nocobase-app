import { EventEmitter } from 'events';

const PROVIDER_NAME = 'zhixin';

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export default function (eventEmitter) {
  eventEmitter.on(`${PROVIDER_NAME}.onChain`, async (nftInfo) => {
    const hasOnChain = await checkOnChainStatus(nftInfo);

    if (!hasOnChain) {
      await submitOnChain(nftInfo);
    }

    eventEmitter.emit(`onSuccess`, nftInfo);
  });
}

// 模拟检查链上是否已经有了
async function checkOnChainStatus(nftInfo) {
  await delay(1000);
  console.log(`>>>>> check on chain status @${PROVIDER_NAME}`);
  return false;
}

async function submitOnChain(nftInfo) {
  await delay(1000 * 10);
  console.log(`>>>>> submit on chain OK @${PROVIDER_NAME}`);
  return true;
}
