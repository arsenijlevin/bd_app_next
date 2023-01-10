import AddDataForm from './AddDataForm';

import { useContext, useEffect } from 'react';

import UpdateDataForm from './UpdateDataForm';

import { KeyDepartmentsContext } from '../../pages/database-viewer/departments';
import { useQuery } from 'react-query';
import { getDepartment } from '../../lib/departments/helpers';
import { useQueryOptions } from '../../lib/useQueryOptions';

export default function Form() {
  const { formMode, departmentKey, setDepartmentToUpdate, departmentToUpdate } =
    useContext(KeyDepartmentsContext);

  const { data } = useQuery(
    ['departments', departmentKey],
    async () => getDepartment(departmentKey),

    useQueryOptions
  );

  useEffect(() => {
    setDepartmentToUpdate && setDepartmentToUpdate(data);
  }, [setDepartmentToUpdate, data, departmentToUpdate]);

  return (
    <div className="container mx-auto py-5">
      {formMode === 'update'
        ? UpdateDataForm({
            departmentToUpdate: departmentToUpdate
          })
        : AddDataForm()}
    </div>
  );
}
