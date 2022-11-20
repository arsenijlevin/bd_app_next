import type { NextApiRequest, NextApiResponse } from 'next';

import { ServiceFormData } from '../services/add';
// import { DateTime } from 'luxon';

// const prisma = new PrismaClient();

interface addRenderedServiceRequest extends NextApiRequest {
  body: ServiceFormData;
}

export default async function addRenderedService(
  req: addRenderedServiceRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  // const reqData = req.body;

  // // TODO: Find id for doctor/patient/service
  // // TODO: Setup serviceData

  // reqData.dateAndTime = DateTime.now().toFormat('yyyy-LL-dd HH:mm:ss');

  // const doctor_id = await prisma.doctors.findFirstOrThrow({
  //   select: {

  //   }
  // })

  // const serviceData = {
  //   date_time: reqData.dateAndTime,
  //   doctor_id: reqData.doctor,
  //   patient_id: reqData.patient,
  //   service_id: reqData.service,
  //   result: reqData.result
  // };

  // const savedService = await prisma.rendered_services.create({
  //   data: serviceData
  // });

  res.status(200).json({});
}
