import AddDataForm from './AddDataForm';

import { useContext, useEffect } from 'react';

import UpdateDataForm from './UpdateDataForm';

import { KeyServicesContext } from '../../pages/database-viewer/services';
import { useQuery } from 'react-query';
import { getService } from '../../lib/services/helpers';
import { useQueryOptions } from '../../lib/useQueryOptions';

export default function Form() {
  const { formMode, serviceKey, setServiceToUpdate, serviceToUpdate } =
    useContext(KeyServicesContext);

  const { data } = useQuery(
    ['services', serviceKey],
    async () => getService(serviceKey),

    useQueryOptions
  );

  useEffect(() => {
    setServiceToUpdate && setServiceToUpdate(data);
  }, [setServiceToUpdate, data, serviceToUpdate]);

  return (
    <div className="container mx-auto py-5">
      {formMode === 'update'
        ? UpdateDataForm({
            serviceToUpdate: serviceToUpdate
          })
        : AddDataForm()}
    </div>
  );
}
