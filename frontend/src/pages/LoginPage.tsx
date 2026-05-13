import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ErrorResponse } from '../types';

type View = 'login' | 'register';

export function LoginPage() {
  const { login, register, continueAsGuest } = useAuth();
  const navigate = useNavigate();

  const [view, setView] = useState<View>('login');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const resetForm = () => {
    setEmail(''); setPassword(''); setFullName('');
    setConfirmPassword(''); setError(null);
    setShowPassword(false); setShowConfirm(false);
  };

  const switchView = (v: View) => { resetForm(); setView(v); };

  const handleLogin = async () => {
    if (!email || !password) { setError('Completa todos los campos.'); return; }
    setLoading(true); setError(null);
    try {
      await login({ email, password });
      navigate('/catalog');
    } catch (err) {
      setError((err as ErrorResponse).detail ?? 'Error al iniciar sesión.');
    } finally { setLoading(false); }
  };

  const handleRegister = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Completa todos los campos.'); return;
    }
    if (password !== confirmPassword) { setError('Las contraseñas no coinciden.'); return; }
    if (password.length < 6) { setError('Mínimo 6 caracteres.'); return; }
    setLoading(true); setError(null);
    try {
      await register({ fullName, email, password });
      navigate('/catalog');
    } catch (err) {
      setError((err as ErrorResponse).detail ?? 'Error al crear la cuenta.');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-md flex flex-col gap-6">
        <div className="flex flex-col items-center gap-2">
          <span className="text-4xl">📚</span>
          <h1 className="text-2xl font-bold text-gray-800">LibraryFlow</h1>
          <p className="text-sm text-gray-400">Sistema de gestión bibliotecaria</p>
        </div>

        <div className="flex rounded-xl bg-gray-100 p-1">
          {(['login', 'register'] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => switchView(v)}
              className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors cursor-pointer ${
                view === v ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {v === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-3">
          {view === 'register' && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Nombre completo</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ej: Carlos López"
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium text-gray-700">Contraseña</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3 py-2 pr-16 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-500 hover:text-blue-700 cursor-pointer font-medium"
              >
                {showPassword ? 'Ocultar' : 'Ver'}
              </button>
            </div>
          </div>

          {view === 'register' && (
            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Confirmar contraseña</label>
              <div className="relative">
                <input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repite tu contraseña"
                  className="w-full px-3 py-2 pr-16 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-500 hover:text-blue-700 cursor-pointer font-medium"
                >
                  {showConfirm ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-500 font-medium text-center">{error}</p>}

        <div className="flex flex-col gap-3">
          <button
            onClick={view === 'login' ? handleLogin : handleRegister}
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold rounded-xl transition-colors cursor-pointer"
          >
            {loading ? 'Cargando...' : view === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">o</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            onClick={() => { continueAsGuest(); navigate('/catalog'); }}
            className="w-full py-2.5 border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-medium rounded-xl transition-colors cursor-pointer"
          >
            Continuar como invitado
          </button>
        </div>

        <p className="text-xs text-gray-400 text-center">
          Los invitados solo pueden consultar el catálogo de libros.
        </p>
      </div>
    </div>
  );
}