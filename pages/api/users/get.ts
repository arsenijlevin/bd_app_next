import type { NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '../../../prisma/controller';

export default function get(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return getUser(req, res).then(() => res.end());
}
