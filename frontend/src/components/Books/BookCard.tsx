import { useState } from 'react';
import type { Book } from '../../types';

interface BookCardProps {
  book: Book;
  onReserve: (bookId: number, userName: string) => Promise<boolean>;
}

export function BookCard({ book, onReserve }: BookCardProps) {
  const [userName, setUserName] = useState<string>('');
  const [isReserving, setIsReserving] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [feedbackType, setFeedbackType] = useState<'success' | 'error'>('success');

  const isOutOfStock = book.stockDisponible === 0;

  const handleReserve = async () => {
    if (!userName.trim()) {
      setFeedback('Ingresa tu nombre para reservar.');
      setFeedbackType('error');
      return;
    }

    setIsReserving(true);
    setFeedback(null);

    const success = await onReserve(book.id, userName.trim());

    if (success) {
      setFeedback('¡Reserva exitosa!');
      setFeedbackType('success');
      setUserName('');
    } else {
      setFeedback('No se pudo completar la reserva.');
      setFeedbackType('error');
    }

    setIsReserving(false);

    // Limpiar el mensaje después de 3 segundos
    setTimeout(() => setFeedback(null), 3000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col gap-4 border border-gray-100 hover:shadow-lg transition-shadow duration-200">
      {/* Info del libro */}
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-bold text-gray-800 leading-tight">
          {book.title}
        </h3>
        <p className="text-sm text-gray-500">{book.author}</p>
      </div>

      {/* Stock */}
      <div className="flex items-center gap-2">
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            isOutOfStock
              ? 'bg-red-100 text-red-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {isOutOfStock ? 'Sin stock' : `${book.stockDisponible} disponibles`}
        </span>
      </div>

      {/* Formulario de reserva */}
      <div className="flex flex-col gap-2">
        <input
          type="text"
          placeholder="Tu nombre"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          disabled={isOutOfStock || isReserving}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:bg-gray-50 disabled:text-gray-400"
        />
        <button
          onClick={handleReserve}
          disabled={isOutOfStock || isReserving}
          className={`w-full py-2 px-4 rounded-lg text-sm font-semibold transition-colors duration-200 ${
            isOutOfStock
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : isReserving
              ? 'bg-blue-300 text-white cursor-wait'
              : 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
          }`}
        >
          {isReserving ? 'Reservando...' : isOutOfStock ? 'No disponible' : 'Reservar'}
        </button>
      </div>

      {/* Feedback */}
      {feedback && (
        <p
          className={`text-xs font-medium text-center ${
            feedbackType === 'success' ? 'text-green-600' : 'text-red-500'
          }`}
        >
          {feedback}
        </p>
      )}
    </div>
  );
}