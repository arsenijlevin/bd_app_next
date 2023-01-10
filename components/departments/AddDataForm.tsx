import { ChangeEvent, FormEvent, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { addDepartment, getDepartments } from '../../lib/departments/helpers';
import { KeyDepartmentsContext } from '../../pages/database-viewer/departments';
import { DepartmentData } from '../../prisma/controllers/departmentsController';

import Error from '../utility/Error';
import Loading from '../utility/Loading';
import Success from '../utility/Success';

export default function AddDataForm() {
  const { formData, setFormData } = useContext(KeyDepartmentsContext);

  const queryClient = useQueryClient();

  const addMutation = useMutation(addDepartment, {
    onSuccess: () => {
      queryClient.prefetchQuery('departments', getDepartments);
    }
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    addMutation.mutate(formData);

    setTimeout(() => {
      addMutation.reset();
      setFormData && setFormData({} as DepartmentData);
    }, 2000);
  };

  if (addMutation.isLoading) return <Loading></Loading>;
  if (addMutation.isError)
    return <Error message="Ошибка при выполнении запроса"></Error>;

  if (addMutation.isSuccess) return <Success message="Успешно!"></Success>;

  return (
    <form className="grid lg:grid-cols-2 w-2/3 gap-4" onSubmit={handleSubmit}>
      <div className="input-type hidden">
        <input
          type="number"
          name="id"
          placeholder="ID"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <div className="input-type">
        <input
          type="text"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFormData &&
              setFormData(
                Object.assign(formData, { title: event.target.value })
              );
          }}
          name="title"
          placeholder="Название"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <div className="input-type">
        <input
          type="number"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFormData &&
              setFormData(
                Object.assign(formData, { floor: event.target.value })
              );
          }}
          name="floor"
          placeholder="Этаж"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>

      <button
        type="submit"
        className="flex justify-center items-center text-md w-1/3 bg-green-500 text-black px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-green-500 hover:text-green-500"
      >
        Добавить
      </button>
    </form>
  );
}
