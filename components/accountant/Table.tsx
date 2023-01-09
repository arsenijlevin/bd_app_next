import { doctorToString, patientToString } from '../../lib/doctors/helpers';
import { renderedServicesJoined } from '../../prisma/controllers/accountantController';

interface ITableProps {
  headers: string[];
  data: renderedServicesJoined[];
}

interface ITableHeaderProps {
  headers: string[];
}

export default function Table({ headers, data }: ITableProps) {
  return (
    <table className="min-w-full table-auto border border-slate-400">
      <TableHeader headers={headers}></TableHeader>
      <tbody className="bg-gray-200">
        {data.map((object: renderedServicesJoined, index: number) => (
          <TableRow key={index} {...object} />
        ))}
      </tbody>
    </table>
  );
}

function TableHeader({ headers }: ITableHeaderProps) {
  return (
    <thead>
      <tr className="bg-gray-800 border-slate-600">
        {headers.map((header: string, index: number) => (
          <th className="px-2 py-2 border border-slate-600" key={index}>
            <span className="text-gray-200">{header}</span>
          </th>
        ))}
      </tr>
    </thead>
  );
}

function TableRow(service: renderedServicesJoined) {
  return (
    <tr className="bg-gray-50 text-center border border-slate-400">
      <td className="border-slate-400 border">
        {service.date_time.toLocaleString()}
      </td>
      <td className="border-slate-400 border px-4">{service.services.title}</td>
      <td className="border-slate-400 border px-4">
        {doctorToString(service.doctors)}
      </td>
      <td className="border-slate-400 border px-4">
        {patientToString(service.patients)}
      </td>
      <td className="border-slate-400 border px-4">
        {parseFloat(service.services.price.toString()).toFixed(2)} руб.
      </td>
      <td className="border-slate-400 border px-4">{service.result}</td>
    </tr>
  );
}
