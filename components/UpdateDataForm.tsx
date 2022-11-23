import { ChangeEvent, Dispatch, FormEvent } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { getUser, getUsers, updateUser } from '../lib/helpers';
import { UserData } from '../prisma/controller';
import { UserFormData } from './AddDataForm';
import Error from './Error';
import Success from './Success';

export default function UpdateDataForm({
  userLogin,
  formData,
  setFormData
}: {
  userLogin: string;
  formData: UserFormData;
  setFormData: Dispatch<ChangeEvent<HTMLInputElement>>;
}) {
  const queryClient = useQueryClient();
  const { isLoading, isError, data } = useQuery(['users', userLogin], () =>
    getUser(userLogin)
  );
  const updateMutation = useMutation(
    (newData: UserData) => updateUser(userLogin, newData),
    {
      onSuccess: async () => {
        queryClient.prefetchQuery('users', getUsers);
        console.log('COMPLETE');
      }
    }
  );

  if (isLoading) return <div>Loading...!</div>;
  if (isError) return <div>Error</div>;

  const { login, password, name, rights_id } = data;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (Object.values(formData).every(value => !value))
      return console.error('Форма пуста');
    console.log(parseInt(rights_id), rights_id);

    const model = Object.assign({}, data, formData, {
      rights_id: isNaN(parseInt(formData.rights_id))
        ? rights_id
        : parseInt(formData.rights_id)
    });

    updateMutation.mutate(model);
  };

  if (updateMutation.isLoading) return <div>Loading!</div>;
  if (updateMutation.isError)
    return <Error message={`Произошла ошибка!`}></Error>;
  if (updateMutation.isSuccess) return <Success message={'Успешно!'}></Success>;

  return (
    <div>
      <h4 className="mb-3">
        Редактируется: <span className="font-bold">{userLogin || ''}</span>
      </h4>
      <form className="grid lg:grid-cols-2 w-2/3 gap-4" onSubmit={handleSubmit}>
        <div className="input-type">
          <input
            type="text"
            onChange={setFormData}
            defaultValue={login || ''}
            name="login"
            placeholder="Логин"
            className="border w-full px-5 py-3 focus:outline-none rounded-md"
          />
        </div>
        <div className="input-type">
          <input
            type="text"
            defaultValue={password || ''}
            onChange={setFormData}
            name="password"
            placeholder="Пароль"
            className="border w-full px-5 py-3 focus:outline-none rounded-md"
          />
        </div>
        <div className="input-type">
          <input
            type="text"
            name="name"
            defaultValue={name || ''}
            onChange={setFormData}
            placeholder="Имя пользователя"
            className="border w-full px-5 py-3 focus:outline-none rounded-md"
          />
        </div>
        <div className="input-type">
          <input
            type="text"
            onChange={setFormData}
            defaultValue={rights_id || ''}
            name="rights_id"
            placeholder="Права"
            className="border w-full px-5 py-3 focus:outline-none rounded-md"
          />
        </div>

        <button className="flex justify-center text-md w-1/3 bg-yellow-500 text-white px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-yellow-50 hover:text-yellow-500">
          Обновить
        </button>
      </form>
    </div>
  );
}
