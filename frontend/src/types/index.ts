// ── Auth ───────────────────────────────────────────────────────────────────
export type UserRole = 'Cliente' | 'Bibliotecario' | 'Invitado';

export interface User {
  id: number;
  email: string;
  fullName: string;
  role: UserRole;
  createdAt: string;
}

export interface AuthResponse {
  accessToken: string;
  tokenType: string;
  expiresIn: number;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
}

export interface CreateUserPayload {
  email: string;
  password: string;
  fullName: string;
}

// ── Books ──────────────────────────────────────────────────────────────────
export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publisher: string;
  year: number;
  description: string;
  coverUrl: string;
  stockDisponible: number;
}

export interface CreateBookPayload {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publisher: string;
  year: number;
  description: string;
  coverUrl: string;
  stockDisponible: number;
}

// ── Reservations ───────────────────────────────────────────────────────────
export type ReservationStatus = 'Activa' | 'Devuelta' | 'Vencida';

export interface Reservation {
  id: number;
  userId: number;
  userFullName: string;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  status: ReservationStatus;
  createdAt: string;
  dueDate: string;
  returnedAt: string | null;
}

export interface CreateReservationPayload {
  bookId: number;
}

// ── Shared ─────────────────────────────────────────────────────────────────
export interface ErrorResponse {
  title: string;
  status: number;
  detail: string;
}

export interface UpdateBookPayload {
  title: string;
  author: string;
  isbn: string;
  genre: string;
  publisher: string;
  year: number;
  description: string;
  coverUrl: string;
  stockDisponible: number;
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';