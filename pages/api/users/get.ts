import type { NextApiRequest, NextApiResponse } from 'next';
import { getUser } from '../../../prisma/controller';

export default function getAll(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  getUser(req, res);
}
