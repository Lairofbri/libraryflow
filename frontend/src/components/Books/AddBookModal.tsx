import { useState } from 'react';
import type { Book, CreateBookPayload } from '../../types';

interface AddBookModalProps {
  onAdd: (payload: CreateBookPayload) => Promise<boolean>;
  onClose: () => void;
  initialData?: Book;
}

export function AddBookModal({ onAdd, onClose, initialData }: AddBookModalProps) {
  const [form, setForm] = useState<CreateBookPayload>({
    title: initialData?.title ?? '',
    author: initialData?.author ?? '',
    isbn: initialData?.isbn ?? '',
    genre: initialData?.genre ?? '',
    publisher: initialData?.publisher ?? '',
    year: initialData?.year ?? new Date().getFullYear(),
    description: initialData?.description ?? '',
    coverUrl: initialData?.coverUrl ?? '',
    stockDisponible: initialData?.stockDisponible ?? 1,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = !!initialData;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === 'stockDisponible' || name === 'year'
          ? Math.max(0, parseInt(value, 10) || 0)
          : value,
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
      setError('No se pudo guardar el libro.');
      setIsSubmitting(false);
    }
  };

  const fields = [
    { label: 'Título *', name: 'title', type: 'text', placeholder: 'Cien años de soledad', col: 2 },
    { label: 'Autor *', name: 'author', type: 'text', placeholder: 'Gabriel García Márquez', col: 2 },
    { label: 'ISBN', name: 'isbn', type: 'text', placeholder: '9780060883287', col: 1 },
    { label: 'Género', name: 'genre', type: 'text', placeholder: 'Realismo mágico', col: 1 },
    { label: 'Editorial', name: 'publisher', type: 'text', placeholder: 'Harper Collins', col: 1 },
    { label: 'Año', name: 'year', type: 'number', placeholder: '1967', col: 1 },
    { label: 'Stock disponible', name: 'stockDisponible', type: 'number', placeholder: '1', col: 1 },
    { label: 'URL Portada', name: 'coverUrl', type: 'text', placeholder: 'https://covers.openlibrary.org/...', col: 1 },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-2xl flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {isEditing ? 'Editar libro' : 'Agregar libro'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer leading-none"
          >
            ×
          </button>
        </div>

        <div className="grid grid-cols-2 gap-4">
          {fields.map(({ label, name, type, placeholder, col }) => (
            <div
              key={name}
              className={`flex flex-col gap-1 ${col === 2 ? 'col-span-2' : 'col-span-1'}`}
            >
              <label className="text-sm font-medium text-gray-700">{label}</label>
              <input
                name={name}
                type={type}
                value={form[name as keyof CreateBookPayload]}
                onChange={handleChange}
                placeholder={placeholder}
                min={type === 'number' ? 0 : undefined}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}

          <div className="col-span-2 flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Descripción</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Breve descripción del libro..."
              rows={3}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
            />
          </div>
        </div>

        {error && <p className="text-sm text-red-500 font-medium">{error}</p>}

        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 cursor-pointer"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-lg text-sm font-semibold bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white cursor-pointer"
          >
            {isSubmitting ? 'Guardando...' : isEditing ? 'Actualizar' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}