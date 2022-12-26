import type { NextApiRequest, NextApiResponse } from 'next';
import { addDoctors } from '../../../prisma/controllers/doctorsController';

export default function getServicesByDate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return addDoctors(req, res)
    .catch(() => {
      res.status(500).json({ message: 'Unexpected error happened' });
    })
    .finally(() => res.end());
}
