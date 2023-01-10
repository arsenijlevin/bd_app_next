import type { NextApiRequest, NextApiResponse } from 'next';
import { getServicesByDateAndDoctorsHandler } from '../../../prisma/controllers/accountantController';

export default function getServicesByDateAndDoctors(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  return getServicesByDateAndDoctorsHandler(req, res)
    .catch(() => {
      res.status(500).json({ message: 'Unexpected error happened' });
    })
    .finally(() => res.end());
}
