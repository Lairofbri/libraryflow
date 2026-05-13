import { useState, useEffect, useCallback } from 'react';
import { fetchUsers, createUser } from '../services/api';
import type { User, CreateUserPayload, ErrorResponse } from '../types';

export function useUsers(token: string | null) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    if (!token) { setLoading(false); return; }
    try {
      const data = await fetchUsers(token);
      setUsers(data);
      setError(null);
    } catch (err) {
      const e = err as ErrorResponse;
      setError(e.detail ?? 'Error al cargar usuarios.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { void loadUsers(); }, [loadUsers]);

  const addUser = useCallback(async (payload: CreateUserPayload): Promise<boolean> => {
    if (!token) return false;
    try {
      await createUser(payload, token);
      await loadUsers();
      return true;
    } catch (err) {
      const e = err as ErrorResponse;
      setError(e.detail ?? 'Error al crear usuario.');
      return false;
    }
  }, [token, loadUsers]);

  return { users, loading, error, addUser, refresh: loadUsers };
}