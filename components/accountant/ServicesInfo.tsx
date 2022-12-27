import { renderedServicesJoined } from '../../prisma/controllers/accountantController';

interface IServicesInfoProps {
  services: renderedServicesJoined[];
}

export default function ServicesInfo({ services }: IServicesInfoProps) {
  console.log(services);

  return (
    <div>
      <h3>Сводная информация: </h3>
      <p>Количество оказанных услуг: {services.length}</p>
      <p>
        Суммарная стоимость оказанных услуг:{' '}
        {services
          .map(service => parseFloat(service.services.price.toString()))
          .reduce((prev, next) => prev + next, 0)
          .toFixed(2)}{' '}
        руб.
      </p>
    </div>
  );
}
