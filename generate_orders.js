#!/usr/bin/env node

const axios = require('axios').default;

const users = [
  'wangpeng@hotmail.com',
  'xiaomin@qq.com',
  'shanshan@qq.com',
  'lijin@gmail.com',
  'liangsc@126.com',
  'guoxiao@163.com',
  'gaoqh@139.com',
  'longke@263.net',
  'chenwen@qq.com',
  'kong.juan@qq.com',
  'jiajia1998@163.com',
];

const URL_BASE = 'http://localhost:12000';

const payments = ['zhifubao', 'weixin'];
const terminals = ['ios', 'android'];

const shuffle = (array) => array.sort(() => Math.random() - 0.5);

function getRandomUser() {
  let _users = [...users];
  shuffle(_users);
  return _users[0];
}

function delay(ms) {
  return function (v) {
    return new Promise((resolve) => setTimeout(() => resolve(v), ms));
  };
}

async function getUserToken(url, auth) {
  const { email, password } = auth;
  const response = await axios.post(url, {
    email,
    password,
  });

  return response.data.data.token;
}

async function showNfts(instance) {
  const response = await instance.get('/nfts:browse');
  return response.data.data.nfts;
}

async function submitOrder(instance, nft) {
  const payMethods = [...payments];
  const _terminals = [...terminals];
  shuffle(payMethods);
  shuffle(_terminals);
  const response = await instance.post('/orders:submit', {
    nft: nft.id,
    pay_method: payMethods[0],
    pay_terminal: _terminals[0],
  });
  return response.data.data.result;
}

async function confirmOrder(instance, order) {
  const { id } = order;
  const response = await instance.post('/orders:confirm', {
    id,
  });
  return response.data.data.order;
}

async function randomOrder() {
  const email = getRandomUser();
  const password = 'password';
  const auth = {
    email,
    password,
  };

  const token = await getUserToken(`${URL_BASE}/api/users:signin`, auth);

  let instance = axios.create({
    baseURL: `${URL_BASE}/api/`,
    headers: { Authorization: `Bearer ${token}` },
  });

  let nfts = await showNfts(instance);
  shuffle(nfts);
  const nft = nfts.find((nft) => nft.sale_status == 'onsale');

  let order = await submitOrder(instance, nft);
  //   console.log({ id });
  order = await confirmOrder(instance, order);
  console.log({ order });
}

(async () => {
  for (let i = 0; i < 1; i++) {
    await randomOrder();
    await delay(100);
  }
})();
