import {
  departments,
  doctors,
  patients,
  Prisma,
  specialties
} from '@prisma/client';
import {
  DoctorData,
  DoctorsJoined
} from '../../prisma/controllers/doctorsController';
import { parseIntIfValueIsString } from '../parseIntIfValueIsString';

export const getDepartments = async (): Promise<departments[]> => {
  const options = {
    method: 'POST'
  };

  return await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/departments/get`,
      options
    )
  ).json();
};

export const getSpecialties = async (): Promise<specialties[]> => {
  const options = {
    method: 'POST'
  };

  return await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/specialties/get`,
      options
    )
  ).json();
};

export const getDoctors = async (): Promise<DoctorsJoined[]> => {
  const options = {
    method: 'POST'
  };

  return await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/doctors/getAll`,
      options
    )
  ).json();
};

export const getDoctor = async (
  doctorId: number
): Promise<DoctorsJoined | undefined> => {
  if (!doctorId) return undefined;

  return await (
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/doctors/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `{
        "doctorId": "${doctorId}"
      }`
    })
  ).json();
};

export const addDoctor = async (formData: DoctorData) => {
  const data: DoctorData = {
    id: parseIntIfValueIsString(formData.id),
    specialty_id: parseIntIfValueIsString(formData.specialty_id),
    department_id: parseIntIfValueIsString(formData.department_id),
    salary: new Prisma.Decimal(
      parseIntIfValueIsString(formData.salary.toString())
    ),
    name: formData.name,
    surname: formData.surname,
    patronymic: formData.patronymic
  };

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/doctors/add`,
    options
  );
  if (!response.ok) {
    return Promise.reject('Unexpected error happened');
  }
  const json = await response.json();

  if (json) return json;
  return {};
};

export const updateDoctor = async (
  doctorId: number | undefined,
  formData: DoctorData
) => {
  if (!doctorId) return {} as DoctorData;

  const data: DoctorData = {
    id: parseIntIfValueIsString(doctorId),
    specialty_id: parseIntIfValueIsString(formData.specialty_id),
    department_id: parseIntIfValueIsString(formData.department_id),
    salary: new Prisma.Decimal(
      parseIntIfValueIsString(formData.salary.toString())
    ),
    name: formData.name,
    surname: formData.surname,
    patronymic: formData.patronymic
  };

  const options = {
    method: 'PUT',
    body: JSON.stringify(data)
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/doctors/modify`,
    options
  );

  if (!response.ok) {
    return Promise.reject('Unexpected error happened');
  }
  const json = await response.json();
  if (json) return json;
  return {};
};

export const deleteDoctor = async (doctorId: number) => {
  const options = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      doctorId: doctorId
    })
  };

  return await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/doctors/delete`,
      options
    )
  ).json();
};

export const doctorToString = (doctor: doctors) => {
  return `(${doctor.id}) ${doctor.surname} ${doctor.name} ${
    doctor.patronymic || ''
  }`;
};

export const patientToString = (patient: patients) => {
  return `(${patient.id}) ${patient.surname} ${patient.name} ${
    patient.patronymic || ''
  }`;
};
