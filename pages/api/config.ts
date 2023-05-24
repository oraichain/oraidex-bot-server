import * as envfile from 'envfile';
import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import config from '../config';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // update config
    const envPath = path.resolve(process.cwd(), '.env.local');
    config.formData = req.body;

    const data = { ...dotenv.config({ path: envPath }).parsed, ...config.formData };

    fs.writeFileSync(envPath, envfile.stringify(data));
  }
  res.json(config);
}
