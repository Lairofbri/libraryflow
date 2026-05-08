import { useState } from 'react';
import type { CreateBookPayload } from '../../types';

interface AddBookModalProps {
  onAdd: (payload: CreateBookPayload) => Promise<boolean>;
  onClose: () => void;
}

const EMPTY_FORM: CreateBookPayload = {
  title: '',
  author: '',
  stockDisponible: 1,
};

export function AddBookModal({ onAdd, onClose }: AddBookModalProps) {
  const [form, setForm] = useState<CreateBookPayload>(EMPTY_FORM);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === 'stockDisponible' ? Math.max(0, parseInt(value, 10) || 0) : value,
    }));
  };

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.author.trim()) {
      setError('Título y autor son obligatorios.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const success = await onAdd(form);

    if (success) {
      onClose();
    } else {
      setError('No se pudo agregar el libro. Intenta de nuevo.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">Agregar libro</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl leading-none cursor-pointer"
          >
            ×
          </button>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Título</label>
            <input
              name="title"
              type="text"
              value={form.title}
              onChange={handleChange}
              placeholder="Ej: Cien años de soledad"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Autor</label>
            <input
              name="author"
              type="text"
              value={form.author}
              onChange={handleChange}
              placeholder="Ej: Gabriel García Márquez"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">
              Stock disponible
            </label>
            <input
              name="stockDisponible"
              type="number"
              min={0}
              value={form.stockDisponible}
              onChange={handleChange}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        {error && (
          <p className="text-sm text-red-500 font-medium">{error}</p>
        )}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 cursor-pointer transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 text-white cursor-pointer disabled:bg-blue-300 transition-colors"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}