import { DateTime } from 'luxon';
import { renderedServicesJoined } from '../../prisma/controllers/accountantController';

export const getServicesByDate = async (
  date: string
): Promise<renderedServicesJoined[]> => {
  if (!date) return [];

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: date
    })
  };

  return await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/accountant/getServicesByDate`,
      options
    )
  ).json();
};

export const getServicesByDateAndDepartment = async (
  date: string,
  departmentId: number
): Promise<renderedServicesJoined[]> => {
  console.log('date', date);
  console.log('DI', departmentId);

  if (!date || !departmentId) return [];

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: date,
      departmentId: departmentId
    })
  };

  const renderedServices: renderedServicesJoined[] = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/accountant/getServicesByDateAndDepartment`,
      options
    )
  ).json();

  return renderedServices.map(service => {
    service.date_time = DateTime.fromISO(
      service.date_time.toString()
    ).toJSDate();
    return service;
  });
};

export const getServicesByDateAndDoctor = async (
  date: string,
  doctorId: number
): Promise<renderedServicesJoined[]> => {
  console.log('date', date);
  console.log('DI', doctorId);

  if (!date || !doctorId) return [];

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: date,
      doctorId: doctorId
    })
  };

  const renderedServices: renderedServicesJoined[] = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/accountant/getServicesByDateAndDoctor`,
      options
    )
  ).json();

  return renderedServices.map(service => {
    service.date_time = DateTime.fromISO(
      service.date_time.toString()
    ).toJSDate();
    return service;
  });
};
