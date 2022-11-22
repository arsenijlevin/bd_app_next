import { useState } from 'react';
import { BiUserPlus } from 'react-icons/bi';

import Form from '../components/Form';
import Table from '../components/Table';

export default function DatabaseViewer() {
  const [visible, setVisible] = useState(false);

  const addButtonOnClickHandler = () => {
    setVisible(!visible);
  };

  return (
    <section className="py-5">
      <h2 className="text-xl md:text-5xl text-center font-bold py-10">
        DatabaseViewer
      </h2>

      <div className="container mx-auto flex justify-between py-5 border-b">
        <div className="left flex gap-3">
          <button
            onClick={addButtonOnClickHandler}
            className="flex bg-indigo-500 text-white px-4 py-2 border rounded-md hover:bg-indigo-300 hover:text-gray-800"
          >
            Добавить
            <span className="px-1">
              <BiUserPlus size={23}></BiUserPlus>
            </span>
          </button>
        </div>
      </div>

      {visible ? <Form></Form> : <></>}

      <div className="container mx-auto">
        <Table></Table>
      </div>
    </section>
  );
}
