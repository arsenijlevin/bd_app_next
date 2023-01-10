import type { NextApiRequest, NextApiResponse } from 'next';
import { getRights } from '../../../prisma/controllers/rightsController';

export default function get(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return getRights(req, res)
    .catch(() => {
      res.status(500).json({ message: 'Unexpected error happened' });
    })
    .finally(() => res.end());
}
