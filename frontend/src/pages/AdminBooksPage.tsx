import { useState } from 'react';
import { useBooks } from '../hooks/useBooks';
import { useAuth } from '../context/AuthContext';
import { createBook, updateBook } from '../services/api';
import { AddBookModal } from '../components/Books/AddBookModal';
import type { Book, CreateBookPayload, UpdateBookPayload } from '../types';

export function AdminBooksPage() {
  const { books, loading, error, refresh } = useBooks();
  const { token } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [search, setSearch] = useState('');

  const filtered = books.filter(
    (b) =>
      b.title.toLowerCase().includes(search.toLowerCase()) ||
      b.author.toLowerCase().includes(search.toLowerCase()) ||
      b.genre.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async (payload: CreateBookPayload): Promise<boolean> => {
    if (!token) return false;
    try {
      await createBook(payload, token);
      await refresh();
      return true;
    } catch {
      return false;
    }
  };

  const handleUpdate = async (payload: UpdateBookPayload): Promise<boolean> => {
    if (!token || !editingBook) return false;
    try {
      await updateBook(editingBook.id, payload, token);
      await refresh();
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de libros</h2>
          <p className="text-sm text-gray-500 mt-1">{books.length} libros en el catálogo</p>
        </div>
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 w-56"
          />
          <button
            onClick={() => { setEditingBook(null); setShowModal(true); }}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-xl cursor-pointer"
          >
            + Agregar libro
          </button>
        </div>
      </div>

      {loading && <div className="text-center py-12 text-gray-400 text-sm">Cargando...</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-6 py-4 text-left">Portada</th>
                <th className="px-6 py-4 text-left">Título</th>
                <th className="px-6 py-4 text-left">Autor</th>
                <th className="px-6 py-4 text-left">Género</th>
                <th className="px-6 py-4 text-left">ISBN</th>
                <th className="px-6 py-4 text-left">Stock</th>
                <th className="px-6 py-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((b) => (
                <tr key={b.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    {b.coverUrl
                      ? <img src={b.coverUrl} alt={b.title} className="w-10 h-14 object-cover rounded" />
                      : <div className="w-10 h-14 bg-gray-100 rounded flex items-center justify-center text-gray-300 text-xs">N/A</div>
                    }
                  </td>
                  <td className="px-6 py-3 font-medium text-gray-800">{b.title}</td>
                  <td className="px-6 py-3 text-gray-600">{b.author}</td>
                  <td className="px-6 py-3 text-gray-500">{b.genre}</td>
                  <td className="px-6 py-3 text-gray-400 font-mono text-xs">{b.isbn}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      b.stockDisponible === 0
                        ? 'bg-red-100 text-red-700'
                        : 'bg-green-100 text-green-700'
                    }`}>
                      {b.stockDisponible === 0 ? 'Sin stock' : `${b.stockDisponible} disp.`}
                    </span>
                  </td>
                  <td className="px-6 py-3">
                    <button
                      onClick={() => { setEditingBook(b); setShowModal(true); }}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg cursor-pointer"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showModal && !editingBook && (
        <AddBookModal
          onAdd={handleAdd}
          onClose={() => setShowModal(false)}
        />
      )}

      {showModal && editingBook && (
        <AddBookModal
          onAdd={(payload) => handleUpdate(payload as UpdateBookPayload)}
          onClose={() => { setShowModal(false); setEditingBook(null); }}
          initialData={editingBook}
        />
      )}
    </div>
  );
}