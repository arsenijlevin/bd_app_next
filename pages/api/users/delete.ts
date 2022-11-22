import type { NextApiRequest, NextApiResponse } from 'next';
import { deleteUsers } from '../../../prisma/controller';

export default function deleteData(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  deleteUsers(req, res);
}
