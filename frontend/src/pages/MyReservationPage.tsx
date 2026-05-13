import { useAuth } from '../context/AuthContext';
import { useReservations } from '../hooks/useReservation';

export function MyReservationsPage() {
  const { token } = useAuth();
  const { reservations, loading, error, returnBook } = useReservations(token);

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-GT', {
      year: 'numeric', month: 'short', day: 'numeric',
    });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Mis reservas</h2>
        <p className="text-sm text-gray-500 mt-1">
          {reservations.length} reserva{reservations.length !== 1 ? 's' : ''} registrada{reservations.length !== 1 ? 's' : ''}
        </p>
      </div>

      {loading && <div className="text-center py-12 text-gray-400 text-sm">Cargando...</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {!loading && !error && reservations.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">No tienes reservas activas.</div>
      )}

      {!loading && !error && reservations.length > 0 && (
        <div className="flex flex-col gap-4">
          {reservations.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-1">
                <p className="font-bold text-gray-800">{r.bookTitle}</p>
                <p className="text-sm text-gray-500">{r.bookAuthor}</p>
                <p className="text-xs text-gray-400">
                  Reservado: {formatDate(r.createdAt)} · Vence: {formatDate(r.dueDate)}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                  r.status === 'Activa' ? 'bg-yellow-100 text-yellow-700' :
                  r.status === 'Devuelta' ? 'bg-green-100 text-green-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {r.status}
                </span>
                {r.status === 'Activa' && (
                  <button
                    onClick={() => void returnBook(r.id)}
                    className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white text-xs font-semibold rounded-lg cursor-pointer"
                  >
                    Devolver
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}