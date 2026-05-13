import { useState } from 'react';
import type { Book } from '../../types';

interface BookCardProps {
  book: Book;
  onReserve: (bookId: number) => Promise<boolean>;
  canReserve: boolean;
}

export function BookCard({ book, onReserve, canReserve }: BookCardProps) {
  const [isReserving, setIsReserving] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');

  const isOutOfStock = book.stockDisponible === 0;

  const handleReserve = async () => {
    setIsReserving(true);
    setFeedback(null);
    const success = await onReserve(book.id);
    setFeedback(success ? '¡Reserva exitosa!' : 'No se pudo completar la reserva.');
    setFeedbackType(success ? 'success' : 'error');
    setIsReserving(false);
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-200 flex flex-col overflow-hidden">
      {book.coverUrl && (
        <img
          src={book.coverUrl}
          alt={book.title}
          className="w-full h-48 object-cover"
          onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
        />
      )}
      <div className="p-5 flex flex-col gap-3 flex-1">
        <div>
          <h3 className="text-base font-bold text-gray-800 leading-tight">{book.title}</h3>
          <p className="text-sm text-gray-500">{book.author} · {book.year}</p>
          <p className="text-xs text-gray-400 mt-0.5">{book.genre} · {book.publisher}</p>
        </div>

        {book.description && (
          <p className="text-xs text-gray-500 line-clamp-2">{book.description}</p>
        )}

        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
            isOutOfStock ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}>
            {isOutOfStock ? 'Sin stock' : `${book.stockDisponible} disponibles`}
          </span>
          <span className="text-xs text-gray-300">ISBN: {book.isbn}</span>
        </div>

        {canReserve ? (
          <button
            onClick={handleReserve}
            disabled={isOutOfStock || isReserving}
            className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : isReserving
                ? 'bg-blue-300 text-white cursor-wait'
                : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
            }`}
          >
            {isReserving ? 'Reservando...' : isOutOfStock ? 'No disponible' : 'Reservar'}
          </button>
        ) : (
          <p className="text-xs text-center text-gray-400">
            Inicia sesión para reservar
          </p>
        )}

        {feedback && (
          <p className={`text-xs font-medium text-center ${
            feedbackType === 'success' ? 'text-green-600' : 'text-red-500'
          }`}>
            {feedback}
          </p>
        )}
      </div>
    </div>
  );
}