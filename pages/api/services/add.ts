import type { NextApiRequest, NextApiResponse } from 'next';
import { addServices } from '../../../prisma/controllers/servicesController';

export default function add(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return addServices(req, res)
    .catch(() => {
      res.status(500).json({ message: 'Unexpected error happened' });
    })
    .finally(() => res.end());
}
