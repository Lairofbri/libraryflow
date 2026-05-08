import { useState, useEffect, useCallback } from 'react';
import { fetchBooks } from '../services/api';
import type { Book, ErrorResponse } from '../types';

const POLLING_INTERVAL = 5000;

export function useBooks() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadBooks = useCallback(async () => {
    try {
      const data = await fetchBooks();
      setBooks(data);
      setError(null);
    } catch (err) {
      const apiError = err as ErrorResponse;
      setError(apiError.detail ?? 'Error al cargar los libros.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Carga inicial
  useEffect(() => {
    void loadBooks();
  }, [loadBooks]);

  // Polling cada 5 segundos para reflejar stock en tiempo real
  useEffect(() => {
    const interval = setInterval(() => {
      void loadBooks();
    }, POLLING_INTERVAL);

    return () => clearInterval(interval);
  }, [loadBooks]);

  return { books, loading, error, refresh: loadBooks };
}