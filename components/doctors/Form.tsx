import AddDataForm from './AddDataForm';

import { useContext, useEffect } from 'react';

import UpdateDataForm from './UpdateDataForm';

import { KeyDoctorsContext } from '../../pages/database-viewer/doctors';
import { useQuery } from 'react-query';
import { getDoctor } from '../../lib/doctors/helpers';
import { useQueryOptions } from '../../lib/useQueryOptions';

export default function Form() {
  const { formMode, doctorKey, setDoctorToUpdate, doctorToUpdate } =
    useContext(KeyDoctorsContext);

  const { data } = useQuery(
    ['doctors', doctorKey],
    async () => getDoctor(doctorKey),

    useQueryOptions
  );

  useEffect(() => {
    setDoctorToUpdate && setDoctorToUpdate(data);
  }, [setDoctorToUpdate, data, doctorToUpdate]);

  return (
    <div className="container mx-auto py-5">
      {formMode === 'update'
        ? UpdateDataForm({
            doctorToUpdate: doctorToUpdate
          })
        : AddDataForm()}
    </div>
  );
}
