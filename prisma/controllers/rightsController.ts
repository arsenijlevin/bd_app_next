import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../db';

export async function getRights(req: NextApiRequest, res: NextApiResponse) {
  try {
    const rights = await prisma.rights.findMany();

    if (!rights) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json(rights);
  } catch (error) {
    throw new Error('500');
  }
}
