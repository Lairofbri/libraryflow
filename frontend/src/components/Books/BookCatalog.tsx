import { useState } from 'react';
import { useBooks } from '../../hooks/useBooks';
import { createBook } from '../../services/api';
import type { CreateBookPayload } from '../../types';
import type { useReservations } from '../../hooks/useReservation';
import { BookCard } from './BookCard';
import { AddBookModal } from './AddBookModal';

interface BookCatalogProps {
  reservationsHook: ReturnType<typeof useReservations>;
}

export function BookCatalog({ reservationsHook }: BookCatalogProps) {
  const { books, loading, error, refresh } = useBooks();
  const { reserve, reserveError } = reservationsHook;
  const [showModal, setShowModal] = useState<boolean>(false);

  const handleAddBook = async (payload: CreateBookPayload): Promise<boolean> => {
    try {
      await createBook(payload);
      await refresh();
      return true;
    } catch {
      return false;
    }
  };

  const handleReserve = async (bookId: number, userName: string): Promise<boolean> => {
    const success = await reserve({ bookId, userName });
    if (success) await refresh();
    return success;
  };

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Catálogo</h2>
          <p className="text-sm text-gray-500 mt-1">
            Stock actualizado cada 5 segundos
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
        >
          + Agregar libro
        </button>
      </div>

      {reserveError && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {reserveError}
        </div>
      )}

      {loading && (
        <div className="text-center py-12 text-gray-400 text-sm">
          Cargando catálogo...
        </div>
      )}

      {error && !loading && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      {!loading && !error && books.length === 0 && (
        <div className="text-center py-12 text-gray-400 text-sm">
          No hay libros en el catálogo. ¡Agrega el primero!
        </div>
      )}

      {!loading && !error && books.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {books.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onReserve={handleReserve}
            />
          ))}
        </div>
      )}

      {showModal && (
        <AddBookModal
          onAdd={handleAddBook}
          onClose={() => setShowModal(false)}
        />
      )}
    </section>
  );
}