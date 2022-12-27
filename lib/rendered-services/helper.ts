import { rendered_services } from '@prisma/client';
import { DateTime } from 'luxon';
import { IDoctorAddServiceForm } from '../../pages/doctor-add-service';

export const addRenderedService = async (formData: IDoctorAddServiceForm) => {
  const data: Omit<rendered_services, 'date_time'> & {
    date_time: string;
  } = {
    date_time: DateTime.now().toFormat('yyyy-MM-dd HH:mm:ss'),
    doctor_id: parseInt(formData.doctorId),
    patient_id: parseInt(formData.patientId),
    service_id: parseInt(formData.serviceId),
    result: formData.result
  };

  const options = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  };

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}api/rendered-services/add`,
    options
  );
  if (!response.ok) {
    return Promise.reject('Unexpected error happened');
  }
  const json = await response.json();

  if (json) return json;
  return {};
};
