import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(_req: NextApiRequest, res: NextApiResponse) {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).json({ sha: process.env.NEXT_PUBLIC_COMMIT_SHA ?? 'unknown' });
}
