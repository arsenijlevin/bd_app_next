import { Prisma } from '@prisma/client';
import { ServiceData } from '../../prisma/controllers/servicesController';
import { parseIntIfValueIsString } from '../parseIntIfValueIsString';

export const getServices = async (): Promise<ServiceData[]> => {
  const options = {
    method: 'POST'
  };

  return await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/services/getAll`,
      options
    )
  ).json();
};

export const getService = async (
  serviceId: number
): Promise<ServiceData | undefined> => {
  if (!serviceId) return undefined;

  return await (
    await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}api/services/get`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: `{
        "serviceId": "${serviceId}"
      }`
    })
  ).json();
};

export const addService = async (formData: ServiceData) => {
  const data: ServiceData = {
    id: parseIntIfValueIsString(formData.id),
    title: formData.title,
    price: new Prisma.Decimal(
      parseIntIfValueIsString(formData.price.toString())
    )
  };

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/services/add`,
    options
  );
  if (!response.ok) {
    return Promise.reject('Unexpected error happened');
  }
  const json = await response.json();

  if (json) return json;
  return {};
};

export const updateService = async (
  serviceId: number | undefined,
  formData: ServiceData
) => {
  if (!serviceId) return {} as ServiceData;

  const data: ServiceData = {
    id: parseIntIfValueIsString(formData.id),
    title: formData.title,
    price: new Prisma.Decimal(
      parseIntIfValueIsString(formData.price.toString())
    )
  };

  const options = {
    method: 'PUT',
    body: JSON.stringify(data)
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/services/modify`,
    options
  );

  if (!response.ok) {
    return Promise.reject('Unexpected error happened');
  }
  const json = await response.json();
  if (json) return json;
  return {};
};

export const deleteService = async (serviceId: number) => {
  const options = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      serviceId: serviceId
    })
  };

  return await (
    await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL}api/services/delete`,
      options
    )
  ).json();
};
