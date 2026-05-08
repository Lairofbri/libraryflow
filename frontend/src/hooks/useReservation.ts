import { useState, useEffect, useCallback } from 'react';
import { fetchReservations, createReservation } from '../services/api';
import type { Reservation, CreateReservationPayload, ErrorResponse, RequestStatus } from '../types';

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [reserveStatus, setReserveStatus] = useState<RequestStatus>('idle');
  const [reserveError, setReserveError] = useState<string | null>(null);

  const loadReservations = useCallback(async () => {
    try {
      const data = await fetchReservations();
      setReservations(data);
      setError(null);
    } catch (err) {
      const apiError = err as ErrorResponse;
      setError(apiError.detail ?? 'Error al cargar las reservas.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReservations();
  }, [loadReservations]);

  const reserve = useCallback(async (payload: CreateReservationPayload): Promise<boolean> => {
    setReserveStatus('loading');
    setReserveError(null);

    try {
      await createReservation(payload);
      setReserveStatus('success');
      await loadReservations();
      return true;
    } catch (err) {
      const apiError = err as ErrorResponse;
      setReserveError(apiError.detail ?? 'Error al crear la reserva.');
      setReserveStatus('error');
      return false;
    }
  }, [loadReservations]);

  return {
    reservations,
    loading,
    error,
    reserveStatus,
    reserveError,
    reserve,
    refresh: loadReservations,
  };
}