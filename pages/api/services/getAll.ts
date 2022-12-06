import type { NextApiRequest, NextApiResponse } from 'next';
import { getServices } from '../../../prisma/controllers/servicesController';

export default function getAll(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return getServices(req, res)
    .catch(() => {
      res.status(500).json({ message: 'Unexpected error happened' });
    })
    .finally(() => res.end());
}
