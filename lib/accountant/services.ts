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

export const getServicesByDateAndDepartments = async (
  date: string,
  departmentIds: number[]
): Promise<renderedServicesJoined[]> => {
  if (!date || departmentIds.length === 0) return [];

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: date,
      departmentIds: departmentIds
    })
  };

  const renderedServices: renderedServicesJoined[] = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/accountant/getServicesByDateAndDepartments`,
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

export const getServicesByDateAndDoctors = async (
  date: string,
  doctorIds: number[]
): Promise<renderedServicesJoined[]> => {
  if (!date || doctorIds.length === 0) return [];

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: date,
      doctorIds: doctorIds
    })
  };

  const renderedServices: renderedServicesJoined[] = await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/accountant/getServicesByDateAndDoctors`,
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
