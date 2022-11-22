import type { NextApiRequest, NextApiResponse } from 'next';
import { addUsers } from '../../../prisma/controller';

export default function add(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  addUsers(req, res);
}
