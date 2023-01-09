import { NextApiRequest, NextApiResponse } from 'next';
import { IDoctorData } from '../interfaces';
import { prisma } from '../db';
import { parseIntIfValueIsString } from '../../lib/parseIntIfValueIsString';
import { Prisma } from '@prisma/client';

export type DoctorData = IDoctorData;

const doctorsInclude = Prisma.validator<Prisma.doctorsInclude>()({
  departments: true,
  specialties: true
});

export type DoctorsJoined = Prisma.doctorsGetPayload<{
  include: typeof doctorsInclude;
}>;

export async function getDoctors(req: NextApiRequest, res: NextApiResponse) {
  try {
    const doctors: DoctorsJoined[] = await prisma.doctors.findMany({
      include: {
        departments: true,
        specialties: true
      }
    });

    if (!doctors) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json(doctors);
  } catch (error) {
    throw new Error('500');
  }
}

export async function addDoctors(req: NextApiRequest, res: NextApiResponse) {
  try {
    const formData: DoctorData = req.body;

    if (!formData) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const doctor = await prisma.doctors.create({
      data: formData
    });

    return res.status(200).json({ doctor: doctor });
  } catch (error) {
    throw new Error('500');
  }
}

export async function modifyDoctors(req: NextApiRequest, res: NextApiResponse) {
  try {
    const formData = JSON.parse(req.body);
    const doctorId: number = formData.id;

    if (!doctorId || !formData) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const doctor = await prisma.doctors.update({
      where: {
        id: doctorId
      },
      data: formData
    });

    return res.status(200).json({ doctor: doctor });
  } catch (error) {
    throw new Error('500');
  }
}

export async function deleteDoctors(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { doctorId } = req.body;

    if (!doctorId) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const doctor = await prisma.doctors.delete({
      where: {
        id: parseIntIfValueIsString(doctorId)
      }
    });

    return res.status(200).json({ deletedDoctor: doctor });
  } catch (error) {
    throw new Error('500');
  }
}

export async function getDoctor(req: NextApiRequest, res: NextApiResponse) {
  try {
    const doctorId = req.body.doctorId;

    if (!doctorId) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const doctors = await prisma.doctors.findFirst({
      where: {
        id: parseIntIfValueIsString(doctorId)
      }
    });

    return res.status(200).json(doctors);
  } catch (error) {
    throw new Error('500');
  }
}
