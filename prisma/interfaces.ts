import {
  departments,
  doctors,
  patients,
  services,
  users
} from '@prisma/client';

export type IUserData = users;
export type IDoctorData = doctors;
export type IServiceData = services;
export type IPatientData = patients;
export type IDepartmentData = departments;
