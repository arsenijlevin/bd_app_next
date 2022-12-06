import { BiX } from 'react-icons/bi';

export default function Error({ message }: { message: string }) {
  return (
    <div className="success container mx-auto">
      <div className="flex justify-center mx-auto border border-red-200 bg-red-400 w-1/2 text-gray-900 text-md my-4 text-center bg-opacity-5">
        {message} <BiX size={23} color={'rgb(248, 133, 133'}></BiX>
      </div>
    </div>
  );
}
