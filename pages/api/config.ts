import config from '@/config';
import dotenv from 'dotenv';
import * as envfile from 'envfile';
import fs from 'fs';
import { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';
import path from 'path';

import { OraiswapLimitOrderClient, OraiswapTokenClient } from '@oraichain/oraidex-contracts-sdk';
import { MakeOrderConfig, decrypt, encrypt, getCoingeckoPrice, getRandomRange, makeOrders, setupWallet } from '@oraichain/orderbook-market-maker';

let password: string | undefined = undefined;

const delay = (timeout: number) => new Promise((r) => setTimeout(r, timeout));
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // update config
    const envPath = path.resolve(process.cwd(), '.env.local');

    const { running, password, newPassword, ...data } = req.body;
    config.running = running;
    if (password) {
      if (!newPassword) {
        return res.status(500).send('New password is not provided!');
      }
      try {
        // test current password then encrypt new password
        const mnemonic = decrypt(req.body.password, process.env.ENCRYPTED_MNEMONIC);
        const encryptedMnemonic = encrypt(req.body.newPassword, mnemonic);
        process.env.ENCRYPTED_MNEMONIC = encryptedMnemonic;
        data.ENCRYPTED_MNEMONIC = encryptedMnemonic;
        // ENCRYPTED_MNEMONIC
      } catch (ex: any) {
        res.status(500).send('Password is not correct!');
      }
    } else {
      Object.assign(config.formData, data);
    }

    fs.writeFileSync(envPath, envfile.stringify({ ...dotenv.config({ path: envPath }).parsed, ...data }));
  }

  // try update password
  const token = await getToken({ req });
  password = token?.sub;

  res.json(config);
}

(async () => {
  while (true) {
    // wait for status
    if (!config.running || !password) {
      await delay(1000);
      continue;
    }

    try {
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
      const [orderIntervalMin, orderIntervalMax] = config.formData.ORDER_INTERVAL_RANGE ? process.env.ORDER_INTERVAL_RANGE.split(',').map(Number) : [50, 100];
      const interval = getRandomRange(orderIntervalMin, orderIntervalMax);
      await delay(interval);
    } catch (ex) {
      console.log(ex);
      await delay(3000);
    }
  }
})();
