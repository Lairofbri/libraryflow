import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { ReactNode } from 'react';

interface NavItem {
  to: string;
  label: string;
  icon: string;
}

export function Layout({ children }: { children: ReactNode }) {
  const { user, isGuest, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems: NavItem[] = [
    { to: '/catalog', label: 'Catálogo', icon: '📚' },
    ...(user?.role === 'Cliente'
      ? [{ to: '/my-reservations', label: 'Mis reservas', icon: '📋' }]
      : []),
    ...(user?.role === 'Bibliotecario'
      ? [
          { to: '/dashboard', label: 'Dashboard', icon: '📊' },
          { to: '/admin/books', label: 'Gestión de libros', icon: '📖' },
          { to: '/admin/users', label: 'Usuarios', icon: '👥' },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full z-10">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <div>
              <h1 className="text-base font-bold text-gray-800 leading-none">LibraryFlow</h1>
              <p className="text-xs text-gray-400">Gestión bibliotecaria</p>
            </div>
          </div>
        </div>

        {/* User info */}
        <div className="px-6 py-4 border-b border-gray-100">
          <p className="text-sm font-semibold text-gray-700 truncate">
            {user?.fullName ?? 'Invitado'}
          </p>
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
            user?.role === 'Bibliotecario'
              ? 'bg-purple-100 text-purple-700'
              : isGuest
              ? 'bg-gray-100 text-gray-500'
              : 'bg-blue-100 text-blue-700'
          }`}>
            {user?.role ?? 'Invitado'}
          </span>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-4 flex flex-col gap-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-800'
                }`
              }
            >
              <span>{item.icon}</span>
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Logout */}
        <div className="px-4 py-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 cursor-pointer transition-colors"
          >
            <span>🚪</span>
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Content */}
      <main className="flex-1 ml-64 px-8 py-8">
        {children}
      </main>
    </div>
  );
}