import type { NextApiRequest, NextApiResponse } from 'next';
import { modifyUsers } from '../../../prisma/controller';

export default function modify(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'PUT') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  modifyUsers(req, res);
}