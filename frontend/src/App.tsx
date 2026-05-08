import { BookCatalog } from './components/Books/BookCatalog';
import { ReservationHistory } from './components/Reservations/ReservationHistory';
import { useReservations } from './hooks/useReservation';

function App() {
  const reservationsHook = useReservations();

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center gap-3">
          <span className="text-2xl">📚</span>
          <div>
            <h1 className="text-xl font-bold text-gray-800 leading-none">
              LibraryFlow
            </h1>
            <p className="text-xs text-gray-400 mt-0.5">
              Sistema de gestión bibliotecaria
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10 flex flex-col gap-12">
        <BookCatalog reservationsHook={reservationsHook} />
        <ReservationHistory reservationsHook={reservationsHook} />
      </main>
    </div>
  );
}

export default App;