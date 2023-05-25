import * as envfile from 'envfile';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import config from '@/config';
import { getToken } from 'next-auth/jwt';

import { OraiswapLimitOrderClient, OraiswapTokenClient } from '@oraichain/oraidex-contracts-sdk';
import { MakeOrderConfig, UserWallet, decrypt, deployOrderbook, deployToken, encrypt, getCoingeckoPrice, makeOrders, setupWallet, toDecimals } from '@oraichain/orderbook-market-maker';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // update config
    const envPath = path.resolve(process.cwd(), '.env.local');
    const data = { ...dotenv.config({ path: envPath }).parsed };
    if (req.body.password) {
      if (!req.body.newPassword) {
        return res.status(500).send('New password is not provided!');
      }
      try {
        // test current password then encrypt new password
        const mnemonic = decrypt(req.body.password, process.env.ENCRYPTED_MNEMONIC);
        const encryptedMnemonic = encrypt(req.body.newPassword, mnemonic);
        process.env.ENCRYPTED_MNEMONIC = encryptedMnemonic;
        Object.assign(data, { ENCRYPTED_MNEMONIC: encryptedMnemonic });
        // ENCRYPTED_MNEMONIC
      } catch (ex: any) {
        res.status(500).send('Password is not correct!');
      }
    } else {
      config.formData = req.body;
      Object.assign(data, req.body);
    }

    fs.writeFileSync(envPath, envfile.stringify(data));
  }
  if (!running) {
    const token = await getToken({ req });
    console.log('password', token?.sub);
    // run(token?.sub);
    run();
  }

  res.json(config);
}

let running = false;
const run = async (password?: string) => {
  running = true;

  while (password) {
    const totalOrders = 10;

    const sender = await setupWallet(decrypt(password, process.env.ENCRYPTED_MNEMONIC));
    const usdtToken = new OraiswapTokenClient(sender.client, sender.address, config.formData.USDT_CONTRACT);
    const orderBook = new OraiswapLimitOrderClient(sender.client, sender.address, config.formData.ORDERBOOK_CONTRACT);

    console.log('sender address: ', sender.address);

    // get price from coingecko
    const oraiPrice = await getCoingeckoPrice('oraichain-token');

    const cancelPercentage = Number(process.env.CANCEL_PERCENTAGE || 1); // 100% cancel
    const [volumeMin, volumeMax] = process.env.VOLUME_RANGE ? process.env.VOLUME_RANGE.split(',').map(Number) : [100000, 150000];
    const buyPercentage = Number(process.env.BUY_PERCENTAGE || 0.55);
    const [spreadMin, spreadMax] = process.env.SPREAD_RANGE ? process.env.SPREAD_RANGE.split(',').map(Number) : [0.003, 0.006];

    const orderConfig: MakeOrderConfig = {
      cancelPercentage,
      volumeMin,
      volumeMax,
      buyPercentage,
      spreadMax,
      spreadMin
    };

    await makeOrders(sender, sender, usdtToken.contractAddress, orderBook.contractAddress, oraiPrice, totalOrders, orderConfig);

    console.log('Balance after matching:');
    console.log({
      buyer: await sender.client.getBalance(sender.address, 'orai').then((b) => b.amount + 'orai'),
      seller: await usdtToken.balance({ address: sender.address }).then((b) => b.balance + 'usdt')
    });

    // waiting for interval then re call again
    // const [orderIntervalMin, orderIntervalMax] = config.formData.ORDER_INTERVAL_RANGE ? process.env.ORDER_INTERVAL_RANGE.split(',').map(Number) : [50, 100];
    // const interval = getRandomRange(orderIntervalMin, orderIntervalMax);
    // await delay(interval);
  }
  running = false;
};
