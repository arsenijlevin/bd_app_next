import { NextApiRequest, NextApiResponse } from 'next';

import { prisma } from '../db';
import { Prisma } from '@prisma/client';

import { DateTime } from 'luxon';

const renderedServicesInclude =
  Prisma.validator<Prisma.rendered_servicesInclude>()({
    doctors: true,
    patients: true,
    services: true
  });

export type renderedServicesJoined = Prisma.rendered_servicesGetPayload<{
  include: typeof renderedServicesInclude;
}>;

export async function getServicesByDateHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { date } = req.body;

    const gte = DateTime.fromFormat(date, 'yyyy-MM')
      .startOf('month')
      .plus({ hours: 3 })
      .toJSDate();
    const lte = DateTime.fromFormat(date, 'yyyy-MM')
      .endOf('month')
      .plus({ hours: 3 })
      .toJSDate();

    console.log('lte', gte);
    console.log('gte', lte);

    const services = await prisma.rendered_services.findMany({
      where: {
        date_time: {
          lte: lte,
          gte: gte
        }
      },
      include: {
        doctors: true,
        patients: true,
        services: true
      }
    });

    if (!services) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json(services);
  } catch (error) {
    console.log(error);

    throw new Error('500');
  }
}

export async function getServicesByDateAndDepartmentHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { date, departmentId } = req.body;

    const gte = DateTime.fromFormat(date, 'yyyy-MM')
      .startOf('month')
      .plus({ hours: 3 })
      .toJSDate();
    const lte = DateTime.fromFormat(date, 'yyyy-MM')
      .endOf('month')
      .plus({ hours: 3 })
      .toJSDate();

    console.log('lte', gte);
    console.log('gte', lte);

    const services = await prisma.rendered_services.findMany({
      where: {
        date_time: {
          lte: lte,
          gte: gte
        },
        doctors: {
          department_id: parseInt(departmentId)
        }
      },
      include: {
        doctors: true,
        patients: true,
        services: true
      },
      orderBy: {
        date_time: 'asc'
      }
    });

    if (!services) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json(services);
  } catch (error) {
    console.log(error);

    throw new Error('500');
  }
}

export async function getServicesByDateAndDoctorHandler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { date, doctorId } = req.body;

    const gte = DateTime.fromFormat(date, 'yyyy-MM')
      .startOf('month')
      .plus({ hours: 3 })
      .toJSDate();
    const lte = DateTime.fromFormat(date, 'yyyy-MM')
      .endOf('month')
      .plus({ hours: 3 })
      .toJSDate();

    console.log('lte', gte);
    console.log('gte', lte);

    const services = await prisma.rendered_services.findMany({
      where: {
        date_time: {
          lte: lte,
          gte: gte
        },
        doctors: {
          id: parseInt(doctorId)
        }
      },
      include: {
        doctors: true,
        patients: true,
        services: true
      },
      orderBy: {
        date_time: 'asc'
      }
    });

    if (!services) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json(services);
  } catch (error) {
    console.log(error);

    throw new Error('500');
  }
}
