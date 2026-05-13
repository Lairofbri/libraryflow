import type {
  Book,
  Reservation,
  User,
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  CreateBookPayload,
  CreateReservationPayload,
  CreateUserPayload,
  ErrorResponse,
  UpdateBookPayload
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

function authHeaders(token: string) {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

// ── Auth ───────────────────────────────────────────────────────────────────

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthResponse>(response);
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await fetch(`${BASE_URL}/api/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleResponse<AuthResponse>(response);
}

// ── Books ──────────────────────────────────────────────────────────────────

export async function fetchBooks(): Promise<Book[]> {
  const response = await fetch(`${BASE_URL}/api/books`);
  return handleResponse<Book[]>(response);
}

export async function createBook(
  payload: CreateBookPayload,
  token: string
): Promise<Book> {
  const response = await fetch(`${BASE_URL}/api/books`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse<Book>(response);
}

// ── Reservations ───────────────────────────────────────────────────────────

export async function fetchReservations(token: string): Promise<Reservation[]> {
  const response = await fetch(`${BASE_URL}/api/reservations`, {
    headers: authHeaders(token),
  });
  return handleResponse<Reservation[]>(response);
}

export async function createReservation(
  payload: CreateReservationPayload,
  token: string
): Promise<Reservation> {
  const response = await fetch(`${BASE_URL}/api/reservations`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse<Reservation>(response);
}

export async function returnReservation(
  reservationId: number,
  token: string
): Promise<Reservation> {
  const response = await fetch(
    `${BASE_URL}/api/reservations/${reservationId}/return`,
    {
      method: 'PUT',
      headers: authHeaders(token),
    }
  );
  return handleResponse<Reservation>(response);
}

// ── Users ──────────────────────────────────────────────────────────────────

export async function fetchUsers(token: string): Promise<User[]> {
  const response = await fetch(`${BASE_URL}/api/users`, {
    headers: authHeaders(token),
  });
  return handleResponse<User[]>(response);
}

export async function createUser(
  payload: CreateUserPayload,
  token: string
): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/users`, {
    method: 'POST',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse<User>(response);
}

export async function updateUser(
  id: number,
  payload: { fullName: string; password?: string },
  token: string
): Promise<User> {
  const response = await fetch(`${BASE_URL}/api/users/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse<User>(response);
}

export async function updateBook(
  id: number,
  payload: UpdateBookPayload,
  token: string
): Promise<Book> {
  const response = await fetch(`${BASE_URL}/api/books/${id}`, {
    method: 'PUT',
    headers: authHeaders(token),
    body: JSON.stringify(payload),
  });
  return handleResponse<Book>(response);
}