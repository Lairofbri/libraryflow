import type { useReservations } from '../../hooks/useReservation';
import { useAuth } from '../../context/AuthContext';

interface ReservationHistoryProps {
  reservationsHook: ReturnType<typeof useReservations>;
}

export function ReservationHistory({ reservationsHook }: ReservationHistoryProps) {
  const { reservations, loading, error, returnBook } = reservationsHook;
  const { user } = useAuth();

  const formatDate = (iso: string): string =>
    new Date(iso).toLocaleString('es-GT', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });

  const statusColor = (status: string) => {
    if (status === 'Activa') return 'bg-blue-100 text-blue-700';
    if (status === 'Devuelta') return 'bg-green-100 text-green-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Historial de reservas</h2>
        <p className="text-sm text-gray-500 mt-1">
          {reservations.length} reserva{reservations.length !== 1 ? 's' : ''} registrada{reservations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {loading && <div className="text-center py-8 text-gray-400 text-sm">Cargando historial...</div>}
      {error && !loading && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      {!loading && !error && reservations.length === 0 && (
        <div className="text-center py-8 text-gray-400 text-sm">Aún no hay reservas registradas.</div>
      )}

      {!loading && !error && reservations.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-gray-100 shadow-sm">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-6 py-4 text-left">#</th>
                {user?.role === 'Bibliotecario' && <th className="px-6 py-4 text-left">Usuario</th>}
                <th className="px-6 py-4 text-left">Libro</th>
                <th className="px-6 py-4 text-left">Estado</th>
                <th className="px-6 py-4 text-left">Fecha</th>
                <th className="px-6 py-4 text-left">Vence</th>
                <th className="px-6 py-4 text-left">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {reservations.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-gray-400">{r.id}</td>
                  {user?.role === 'Bibliotecario' && (
                    <td className="px-6 py-4 font-medium text-gray-800">{r.userFullName}</td>
                  )}
                  <td className="px-6 py-4 text-gray-700">{r.bookTitle}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${statusColor(r.status)}`}>
                      {r.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{formatDate(r.createdAt)}</td>
                  <td className="px-6 py-4 text-gray-400">{formatDate(r.dueDate)}</td>
                  <td className="px-6 py-4">
                    {r.status === 'Activa' && (
                      <button
                        onClick={() => void returnBook(r.id)}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        Devolver
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}