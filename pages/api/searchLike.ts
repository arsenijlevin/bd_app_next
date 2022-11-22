// TODO:

import type { NextApiRequest, NextApiResponse } from 'next';

//import { prisma } from '../../prisma/db';

const LIKE_SEARCH_TABLES = ['doctors', 'patients', 'services'];

//const LIKE_SEARCH_FIELDS = ['name', 'surname', 'patronymic'];

interface addRenderedServiceRequest extends NextApiRequest {
  body: {
    table: string;
    field: string;
    query: string;
  };
}

export default async function addRenderedService(
  req: addRenderedServiceRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const reqData = req.body;

  if (!LIKE_SEARCH_TABLES.includes(reqData.table))
    return res.status(405).json({ message: 'Method not allowed' });

  // TODO: Find id for doctor/patient/service
  // TODO: Setup serviceData

  res.status(200).json({});
}
