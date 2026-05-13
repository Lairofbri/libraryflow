import { useState, useEffect, useCallback } from 'react';
import { fetchReservations, createReservation, returnReservation } from '../services/api';
import type { Reservation, CreateReservationPayload, ErrorResponse, RequestStatus } from '../types';

export function useReservations(token: string | null) {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reserveStatus, setReserveStatus] = useState<RequestStatus>('idle');
  const [reserveError, setReserveError] = useState<string | null>(null);

  const loadReservations = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const data = await fetchReservations(token);
      setReservations(data);
      setError(null);
    } catch (err) {
      const apiError = err as ErrorResponse;
      setError(apiError.detail ?? 'Error al cargar las reservas.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { void loadReservations(); }, [loadReservations]);

  const reserve = useCallback(async (payload: CreateReservationPayload): Promise<boolean> => {
    if (!token) return false;
    setReserveStatus('loading');
    setReserveError(null);
    try {
      await createReservation(payload, token);
      setReserveStatus('success');
      await loadReservations();
      return true;
    } catch (err) {
      const apiError = err as ErrorResponse;
      setReserveError(apiError.detail ?? 'Error al crear la reserva.');
      setReserveStatus('error');
      return false;
    }
  }, [token, loadReservations]);

  const returnBook = useCallback(async (reservationId: number): Promise<boolean> => {
    if (!token) return false;
    try {
      await returnReservation(reservationId, token);
      await loadReservations();
      return true;
    } catch (err) {
      const apiError = err as ErrorResponse;
      setReserveError(apiError.detail ?? 'Error al devolver el libro.');
      return false;
    }
  }, [token, loadReservations]);

  return {
    reservations,
    loading,
    error,
    reserveStatus,
    reserveError,
    reserve,
    returnBook,
    refresh: loadReservations,
  };
}