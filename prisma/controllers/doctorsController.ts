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

export async function getDoctorByUserLogin(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userLogin } = req.body;
    const doctor = await prisma.users_doctors.findFirst({
      where: {
        user_login: userLogin
      },
      include: {
        doctors: true
      }
    });

    if (!doctor) return res.status(404).json({ error: 'Not found' });

    return res.status(200).json(doctor);
  } catch (error) {
    throw new Error('500');
  }
}

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
    const formData: DoctorData & {
      doctor_user_login: string;
    } = req.body;

    if (!formData) {
      return res.status(404).json({ error: 'Data is not provided' });
    }

    const doctor = await prisma.doctors.create({
      data: {
        id: formData.id,
        specialty_id: formData.specialty_id,
        department_id: formData.department_id,
        salary: formData.salary,
        name: formData.name,
        surname: formData.surname,
        patronymic: formData.patronymic
      }
    });

    const user_doctor = await prisma.users_doctors.create({
      data: {
        doctor_id: doctor.id,
        user_login: formData.doctor_user_login
      }
    });

    return res.status(200).json({ doctor: doctor, user_doctor: user_doctor });
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
