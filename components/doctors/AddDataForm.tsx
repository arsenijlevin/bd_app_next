import { ChangeEvent, FormEvent, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { addDoctor, getDoctors } from '../../lib/doctors/helpers';
import { KeyDoctorsContext } from '../../pages/database-viewer/doctors';
import { DoctorData } from '../../prisma/controllers/doctorsController';

import Error from '../utility/Error';
import Loading from '../utility/Loading';
import Success from '../utility/Success';

export default function AddDataForm() {
  const { formData, setFormData } = useContext(KeyDoctorsContext);

  const queryClient = useQueryClient();

  const addMutation = useMutation(addDoctor, {
    onSuccess: () => {
      queryClient.prefetchQuery('doctors', getDoctors);
    }
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    addMutation.mutate(formData);

    setTimeout(() => {
      addMutation.reset();
      setFormData && setFormData({} as DoctorData);
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
          type="number"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFormData &&
              setFormData(
                Object.assign(formData, { specialty_id: event.target.value })
              );
          }}
          name="specialty_id"
          placeholder="Специальность"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <div className="input-type">
        <input
          type="number"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFormData &&
              setFormData(
                Object.assign(formData, { department_id: event.target.value })
              );
          }}
          name="department_id"
          placeholder="Отделение"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <div className="input-type">
        <input
          type="number"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFormData &&
              setFormData(
                Object.assign(formData, { salary: event.target.value })
              );
          }}
          name="salary"
          placeholder="Зарплата"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <div className="input-type">
        <input
          type="text"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFormData &&
              setFormData(
                Object.assign(formData, { name: event.target.value })
              );
          }}
          name="name"
          placeholder="Имя"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <div className="input-type">
        <input
          type="text"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFormData &&
              setFormData(
                Object.assign(formData, { surname: event.target.value })
              );
          }}
          name="name"
          placeholder="Фамилия"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <div className="input-type">
        <input
          type="text"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFormData &&
              setFormData(
                Object.assign(formData, { patronymic: event.target.value })
              );
          }}
          name="patronymic"
          placeholder="Отчество"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <button
        type="submit"
        className="flex justify-center items-center text-md w-1/3 bg-green-500 text-black px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-green-500 hover:text-green-500"
      >
        Готово
      </button>
    </form>
  );
}
