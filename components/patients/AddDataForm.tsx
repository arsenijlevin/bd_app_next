import { ChangeEvent, FormEvent, useContext } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import { addPatient, getPatients } from '../../lib/patients/helpers';
import { KeyPatientsContext } from '../../pages/patients-add';
import { PatientData } from '../../prisma/controllers/patientsController';

import Error from '../utility/Error';
import Loading from '../utility/Loading';
import Success from '../utility/Success';

export default function AddDataForm() {
  const { formData, setFormData } = useContext(KeyPatientsContext);

  const queryClient = useQueryClient();

  const addMutation = useMutation(addPatient, {
    onSuccess: () => {
      queryClient.prefetchQuery('patients', getPatients);
    }
  });

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    addMutation.mutate(formData);

    setTimeout(() => {
      addMutation.reset();
      setFormData && setFormData({} as PatientData);
    }, 2000);
  };

  if (addMutation.isLoading) return <Loading></Loading>;
  if (addMutation.isError)
    return <Error message="Ошибка при выполнении запроса"></Error>;

  if (addMutation.isSuccess) return <Success message="Успешно!"></Success>;

  return (
    <form className="grid lg:grid-cols-2 w-2/3 gap-4" onSubmit={handleSubmit}>
      <div className="input-type">
        <input
          type="email"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFormData &&
              setFormData(
                Object.assign(formData, { email: event.target.value })
              );
          }}
          name="email"
          placeholder="Email"
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
          name="surname"
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
      <div className="input-type">
        <input
          type="date"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFormData &&
              setFormData(
                Object.assign(formData, { birthday: event.target.value })
              );
          }}
          name="birthday"
          placeholder="Дата рождения"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <div className="input-type">
        <select
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            setFormData &&
              setFormData(
                Object.assign(formData, {
                  gender:
                    event.target[event.target.selectedIndex].getAttribute(
                      'data-id'
                    )
                })
              );
          }}
          defaultValue="-"
          name="gender"
          placeholder="Пол"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        >
          <option>Выберите пол</option>
          <option data-id="М">М</option>
          <option data-id="Ж">Ж</option>
        </select>
      </div>
      <div className="input-type">
        <input
          type="text"
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setFormData &&
              setFormData(
                Object.assign(formData, { phone_number: event.target.value })
              );
          }}
          name="phone_number"
          placeholder="Номер телефона"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <button
        type="submit"
        className="flex justify-center text-md w-1/3 bg-green-500 text-black px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-green-500 hover:text-green-500"
      >
        Добавить
      </button>
    </form>
  );
}
