import { Oval } from 'react-loader-spinner';

export default function Loading() {
  return (
    <Oval
      height={80}
      width={80}
      color="#4fa94d"
      wrapperClass="h-screen w-screen absolute z-50 flex items-center justify-center"
      visible={true}
      ariaLabel="loading"
      secondaryColor="#4fa94d"
      strokeWidth={5}
      strokeWidthSecondary={5}
    />
  );
}
