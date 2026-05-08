export interface Book {
  id: number;
  title: string;
  author: string;
  stockDisponible: number;
}

export interface Reservation {
  id: number;
  userName: string;
  bookId: number;
  bookTitle: string;
  bookAuthor: string;
  createdAt: string;
}

export interface CreateBookPayload {
  title: string;
  author: string;
  stockDisponible: number;
}

export interface CreateReservationPayload {
  bookId: number;
  userName: string;
}

export interface ErrorResponse {
  title: string;
  status: number;
  detail: string;
}

export type RequestStatus = 'idle' | 'loading' | 'success' | 'error';