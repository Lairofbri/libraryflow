import { useAuth } from '../context/AuthContext';
import { useReservations } from '../hooks/useReservation';

export function DashboardPage() {
  const { token } = useAuth();
  const { reservations, loading, error } = useReservations(token);

  const stats = {
    total: reservations.length,
    activas: reservations.filter((r) => r.status === 'Activa').length,
    devueltas: reservations.filter((r) => r.status === 'Devuelta').length,
    vencidas: reservations.filter((r) => r.status === 'Vencida').length,
  };

  const cards = [
    { label: 'Total reservas', value: stats.total, color: 'bg-blue-50 text-blue-700', icon: '📋' },
    { label: 'Activas', value: stats.activas, color: 'bg-yellow-50 text-yellow-700', icon: '🕐' },
    { label: 'Devueltas', value: stats.devueltas, color: 'bg-green-50 text-green-700', icon: '✅' },
    { label: 'Vencidas', value: stats.vencidas, color: 'bg-red-50 text-red-700', icon: '⚠️' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <p className="text-sm text-gray-500 mt-1">Resumen general del sistema</p>
      </div>

      {loading && <div className="text-center py-12 text-gray-400 text-sm">Cargando datos...</div>}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((c) => (
              <div key={c.label} className={`rounded-2xl p-6 flex flex-col gap-2 ${c.color}`}>
                <span className="text-3xl">{c.icon}</span>
                <p className="text-3xl font-bold">{c.value}</p>
                <p className="text-sm font-medium">{c.label}</p>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-bold text-gray-800">Reservas recientes</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
                  <tr>
                    <th className="px-6 py-3 text-left">Usuario</th>
                    <th className="px-6 py-3 text-left">Libro</th>
                    <th className="px-6 py-3 text-left">Estado</th>
                    <th className="px-6 py-3 text-left">Vence</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {reservations.slice(0, 10).map((r) => (
                    <tr key={r.id} className="hover:bg-gray-50">
                      <td className="px-6 py-3 font-medium text-gray-800">{r.userFullName}</td>
                      <td className="px-6 py-3 text-gray-600">{r.bookTitle}</td>
                      <td className="px-6 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          r.status === 'Activa' ? 'bg-yellow-100 text-yellow-700' :
                          r.status === 'Devuelta' ? 'bg-green-100 text-green-700' :
                          'bg-red-100 text-red-700'
                        }`}>{r.status}</span>
                      </td>
                      <td className="px-6 py-3 text-gray-400">
                        {new Date(r.dueDate).toLocaleDateString('es-GT')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}