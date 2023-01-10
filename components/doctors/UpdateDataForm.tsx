import { departments, specialties, users } from '@prisma/client';
import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import {
  getDepartments,
  getDoctors,
  getSpecialties,
  updateDoctor
} from '../../lib/doctors/helpers';
import { getDoctorUsers } from '../../lib/users/helpers';
import {
  DoctorFormData,
  KeyDoctorsContext
} from '../../pages/database-viewer/doctors';

import { DoctorData } from '../../prisma/controllers/doctorsController';
import Error from '../utility/Error';
import Loading from '../utility/Loading';
import Success from '../utility/Success';

interface IUpdateForm {
  doctorToUpdate: DoctorData | undefined;
}

export default function UpdateDataForm({ doctorToUpdate }: IUpdateForm) {
  const { formData, setFormData, setFormMode } = useContext(KeyDoctorsContext);
  const [specialties, setSpecialties] = useState([] as specialties[]);
  const [departments, setDepartments] = useState([] as departments[]);
  const [doctorUsers, setDoctorUsers] = useState([] as users[]);

  const queryClient = useQueryClient();

  const updateMutation = useMutation(
    (newData: DoctorData) => updateDoctor(doctorToUpdate?.id, newData),
    {
      onSuccess: async () => {
        queryClient.prefetchQuery('doctors', getDoctors);
      },
      onError: async () => {
        updateMutation.isError = true;
      }
    }
  );

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();

    if (Object.values(formData).every(value => !value))
      return <div>Необходимо заполнить форму</div>;

    const model = Object.assign({}, doctorToUpdate, formData);

    updateMutation.mutate(model);

    setTimeout(() => {
      updateMutation.reset();
      setFormData && setFormData({} as DoctorFormData);
      setFormMode && setFormMode('add');
    }, 2000);
  };

  if (updateMutation.isLoading || !doctorToUpdate) return <Loading></Loading>;
  if (updateMutation.isError)
    return <Error message="Ошибка при выполнении запроса"></Error>;

  if (updateMutation.isSuccess) return <Success message="Успешно!"></Success>;

  const { id, specialty_id, department_id, salary, name, surname, patronymic } =
    doctorToUpdate;

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

  if (doctorUsers.length === 0) {
    getDoctorUsers().then(doctorUsers => {
      setDoctorUsers && setDoctorUsers(doctorUsers);
    });
  }
  return (
    <div key={doctorToUpdate.id}>
      <form className="grid lg:grid-cols-2 w-2/3 gap-4" onSubmit={handleSubmit}>
        <div className="input-type hidden">
          <input
            type="number"
            name="id"
            defaultValue={id}
            placeholder="ID"
            className="border w-full px-5 py-3 focus:outline-none rounded-md"
          />
        </div>
        <div className="input-type">
          <select
            name="specialty_id"
            id="specialty_id"
            className="border w-full px-5 py-3 focus:outline-none rounded-md"
            defaultValue={`(${specialties[specialty_id - 1].id}) ${
              specialties[specialty_id - 1].title
            }`}
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
            defaultValue={`(${departments[department_id - 1].id}) ${
              departments[department_id - 1].title
            }`}
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
            defaultValue={salary.toString()}
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
            defaultValue={name}
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
            defaultValue={surname}
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
            defaultValue={patronymic || ''}
            name="patronymic"
            placeholder="Отчество"
            className="border w-full px-5 py-3 focus:outline-none rounded-md"
          />
        </div>
        <button className="flex justify-center text-md w-1/3 bg-yellow-500 text-white px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-yellow-50 hover:text-yellow-500">
          Обновить
        </button>
      </form>
      <h4 className="mb-3 mt-2">
        Редактируется:{' '}
        <span className="font-bold">{`(${id}) ${surname} ${name} ${
          patronymic || ''
        }`}</span>
      </h4>
    </div>
  );
}
