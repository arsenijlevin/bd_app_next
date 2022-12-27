import { useRouter } from 'next/router';
import { MouseEvent } from 'react';
import { logoutUser } from '../../lib/auth/helpers';

export default function Logout() {
  const router = useRouter();

  const handleLogout = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    await logoutUser();

    router.push(`/login`);
  };

  return (
    <div className="success container mx-auto">
      <button
        onClick={handleLogout}
        className="flex justify-center items-center text-md w-2/9 bg-red-700 text-white px-4 py-2 border rounded-md hover:bg-gray-50 hover:border-red-500 hover:text-red-500"
      >
        Выйти
      </button>
    </div>
  );
}
