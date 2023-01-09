import { departments, specialties } from '@prisma/client';
import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  addDoctor,
  getDepartments,
  getDoctors,
  getSpecialties
} from '../../lib/doctors/helpers';
import { KeyDoctorsContext } from '../../pages/database-viewer/doctors';
import { DoctorData } from '../../prisma/controllers/doctorsController';

import Error from '../utility/Error';
import Loading from '../utility/Loading';
import Success from '../utility/Success';

export default function AddDataForm() {
  const { formData, setFormData } = useContext(KeyDoctorsContext);
  const [specialties, setSpecialties] = useState([] as specialties[]);
  const [departments, setDepartments] = useState([] as departments[]);

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

  if (specialties.length === 0) {
    getSpecialties().then(specs => {
      setSpecialties && setSpecialties(specs);
    });
  }

  if (departments.length === 0) {
    getDepartments().then(deps => {
      setDepartments && setDepartments(deps);
    });
  }

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
        <select
          name="specialty_id"
          id="specialty_id"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            setFormData &&
              setFormData(
                Object.assign(formData, {
                  specialty_id:
                    event.target[event.target.selectedIndex].getAttribute(
                      'data-id'
                    )
                })
              );
          }}
        >
          {specialties.map((spec, index) => {
            return (
              <option
                key={index}
                data-id={spec.id}
              >{`(${spec.id}) ${spec.title}`}</option>
            );
          })}
        </select>
      </div>
      <div className="input-type">
        <select
          name="department_id"
          id="department_id"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
          onChange={(event: ChangeEvent<HTMLSelectElement>) => {
            setFormData &&
              setFormData(
                Object.assign(formData, {
                  department_id:
                    event.target[event.target.selectedIndex].getAttribute(
                      'data-id'
                    )
                })
              );
          }}
        >
          {departments.map((department, index) => {
            return (
              <option
                key={index}
                data-id={department.id}
              >{`(${department.id}) ${department.title}`}</option>
            );
          })}
        </select>
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
          placeholder="Зарплата, руб."
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
        Добавить
      </button>
    </form>
  );
}
