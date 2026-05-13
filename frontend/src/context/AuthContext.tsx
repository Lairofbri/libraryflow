import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import type { User, AuthResponse, LoginPayload, RegisterPayload } from '../types';
import { login as loginApi, register as registerApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isGuest: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  continueAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = sessionStorage.getItem('lf_user');
    return stored ? (JSON.parse(stored) as User) : null;
  });

  const [token, setToken] = useState<string | null>(() =>
    sessionStorage.getItem('lf_token')
  );

  const [isGuest, setIsGuest] = useState<boolean>(() =>
    sessionStorage.getItem('lf_guest') === 'true'
  );

  const saveSession = useCallback((response: AuthResponse) => {
    setUser(response.user);
    setToken(response.accessToken);
    setIsGuest(false);
    sessionStorage.setItem('lf_user', JSON.stringify(response.user));
    sessionStorage.setItem('lf_token', response.accessToken);
    sessionStorage.removeItem('lf_guest');
  }, []);

  const login = useCallback(async (payload: LoginPayload) => {
    const response = await loginApi(payload);
    saveSession(response);
  }, [saveSession]);

  const register = useCallback(async (payload: RegisterPayload) => {
    const response = await registerApi(payload);
    saveSession(response);
  }, [saveSession]);

  const continueAsGuest = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsGuest(true);
    sessionStorage.setItem('lf_guest', 'true');
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setIsGuest(false);
    sessionStorage.clear();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user && !!token,
        isGuest,
        login,
        register,
        continueAsGuest,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return context;
}