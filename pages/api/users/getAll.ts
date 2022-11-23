import type { NextApiRequest, NextApiResponse } from 'next';
import { getUsers } from '../../../prisma/controller';

export default function getAll(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return getUsers(req, res).then(() => res.end());
}
