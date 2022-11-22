import { ChangeEvent, FormEvent, useReducer } from 'react';
// import Error from "./Error"

type UserFormData = {
  login: string;
  password: string;
  username: string;
  rights: string;
};

const formReducer = (
  state: UserFormData,
  event: ChangeEvent<HTMLInputElement>
) => {
  return {
    ...state,
    [event.target.name]: event.target.value
  };
};

export default function AddUserForm() {
  const [formData, setFormData] = useReducer(formReducer, {
    login: '',
    password: '',
    username: '',
    rights: ''
  });

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (Object.values(formData).every(value => value.length === 0))
      return console.error('Форма пуста');

    console.log(Object.values(formData));
  };

  // if (Object.keys(formData).length > 0) return <Error message='Произошла ошибка!'></Error>

  return (
    <form className="grid lg:grid-cols-2 w-2/3 gap-4" onSubmit={handleSubmit}>
      <div className="input-type">
        <input
          type="text"
          onChange={setFormData}
          name="login"
          placeholder="Логин"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <div className="input-type">
        <input
          type="text"
          onChange={setFormData}
          name="password"
          placeholder="Пароль"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <div className="input-type">
        <input
          type="text"
          name="username"
          onChange={setFormData}
          placeholder="Имя пользователя"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>
      <div className="input-type">
        <input
          type="text"
          onChange={setFormData}
          name="rights"
          placeholder="Права"
          className="border w-full px-5 py-3 focus:outline-none rounded-md"
        />
      </div>

      <button className="flex justify-center text-md w-1/3 bg-green-500 text-white px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-green-500 hover:text-green-500">
        Готово
      </button>
    </form>
  );
}
