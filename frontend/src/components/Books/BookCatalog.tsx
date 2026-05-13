import { useState } from 'react';
import { useBooks } from '../../hooks/useBooks';
import type { useReservations } from '../../hooks/useReservation';
import { useAuth } from '../../context/AuthContext';
import { BookCard } from './BookCard';

interface BookCatalogProps {
  reservationsHook: ReturnType<typeof useReservations>;
}

export function BookCatalog({ reservationsHook }: BookCatalogProps) {
  const { books, loading, error, refresh } = useBooks();
  const { reserve, reserveError } = reservationsHook;
  const { isAuthenticated } = useAuth();
  const [search, setSearch] = useState('');

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.genre.toLowerCase().includes(search.toLowerCase())
  );

  const handleReserve = async (bookId: number): Promise<boolean> => {
    const success = await reserve({ bookId });
    if (success) await refresh();
    return success;
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Catálogo</h2>
          <p className="text-sm text-gray-500 mt-1">Stock actualizado cada 5 segundos</p>
        </div>
        <input
          type="text"
          placeholder="Buscar por título, autor o género..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-72"
        />
      </div>

      {reserveError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {reserveError}
        </div>
      )}

      {loading && <div className="text-center py-12 text-gray-400 text-sm">Cargando catálogo...</div>}
      {error && !loading && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}
      {!loading && !error && filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          {search ? 'No se encontraron libros con ese criterio.' : 'No hay libros en el catálogo.'}
        </div>
      )}

      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onReserve={handleReserve}
              canReserve={isAuthenticated}
            />
          ))}
        </div>
      )}
    </section>
  );
}