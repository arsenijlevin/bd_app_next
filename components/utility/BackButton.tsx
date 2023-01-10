import { BiArrowBack } from 'react-icons/bi';
import Router from 'next/router';

export default function BackButton() {
  return (
    <div className="left flex gap-3 pt-3">
      <button
        onClick={() => Router.back()}
        className="w-28 flex justify-center items-center text-md w-2/9 bg-blue-500 text-white px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-blue-500 hover:text-blue-500"
      >
        <BiArrowBack className="mr-2"></BiArrowBack>
        Назад
      </button>
    </div>
  );
}
