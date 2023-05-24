import { NextApiRequest, NextApiResponse } from 'next';
import { encrypt } from '@oraichain/orderbook-market-maker';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { mnemonic, password } = req.body;
  res.send(encrypt(password, mnemonic));
}
