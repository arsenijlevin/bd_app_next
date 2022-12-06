import AddDataForm from './AddDataForm';

import { useContext, useEffect } from 'react';

import UpdateDataForm from './UpdateDataForm';

import { KeyUsersContext } from '../../pages/database-viewer/users';
import { useQuery } from 'react-query';
import { getUser } from '../../lib/users/helpers';
import { useQueryOptions } from '../../lib/useQueryOptions';

export default function Form() {
  const { formMode, userKey, setUserToUpdate, userToUpdate } =
    useContext(KeyUsersContext);

  const { data } = useQuery(
    ['users', userKey],
    async () => getUser(userKey),

    useQueryOptions
  );

  useEffect(() => {
    setUserToUpdate && setUserToUpdate(data);
  }, [setUserToUpdate, data, userToUpdate]);

  return (
    <div className="container mx-auto py-5">
      {formMode === 'update'
        ? UpdateDataForm({
            userToUpdate: userToUpdate
          })
        : AddDataForm()}
    </div>
  );
}
