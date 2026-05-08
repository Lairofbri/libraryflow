import type {
  Book,
  Reservation,
  CreateBookPayload,
  CreateReservationPayload,
  ErrorResponse,
} from '../types';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5066';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const error: ErrorResponse = await response.json().catch(() => ({
      title: 'Error',
      status: response.status,
      detail: response.statusText,
    }));
    throw error;
  }
  return response.json() as Promise<T>;
}

// ── Books ──────────────────────────────────────────────────────────────────

export async function fetchBooks(): Promise<Book[]> {
  const response = await fetch(`${BASE_URL}/api/books`);
  return handleResponse<Book[]>(response);
}

export async function createBook(payload: CreateBookPayload): Promise<Book> {
  const response = await fetch(`${BASE_URL}/api/books`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Book>(response);
}

// ── Reservations ───────────────────────────────────────────────────────────

export async function fetchReservations(): Promise<Reservation[]> {
  const response = await fetch(`${BASE_URL}/api/reservations`);
  return handleResponse<Reservation[]>(response);
}

export async function createReservation(
  payload: CreateReservationPayload
): Promise<Reservation> {
  const response = await fetch(`${BASE_URL}/api/reservations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<Reservation>(response);
}