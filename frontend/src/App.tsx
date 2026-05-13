import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useReservations } from './hooks/useReservation';
import { Layout } from './components/Layout';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { AdminBooksPage } from './pages/AdminBooksPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { MyReservationsPage } from './pages/MyReservationPage';
import { BookCatalog } from './components/Books/BookCatalog';

function AppContent() {
  const { isAuthenticated, isGuest, user, token } = useAuth();
  const reservationsHook = useReservations(token);
  const hasAccess = isAuthenticated || isGuest;

  if (!hasAccess) return <Navigate to="/login" replace />;

  return (
    <Layout>
      <Routes>
        <Route path="/catalog" element={<BookCatalog reservationsHook={reservationsHook} />} />

        {user?.role === 'Cliente' && (
          <Route path="/my-reservations" element={<MyReservationsPage />} />
        )}

        {user?.role === 'Bibliotecario' && (
          <>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/admin/books" element={<AdminBooksPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
          </>
        )}

        <Route
          path="*"
          element={
            <Navigate
              to={user?.role === 'Bibliotecario' ? '/dashboard' : '/catalog'}
              replace
            />
          }
        />
      </Routes>
    </Layout>
  );
}

function AppRoutes() {
  const { isAuthenticated, isGuest } = useAuth();
  const hasAccess = isAuthenticated || isGuest;

  return (
    <Routes>
      <Route
        path="/login"
        element={hasAccess ? <Navigate to="/catalog" replace /> : <LoginPage />}
      />
      <Route path="/*" element={<AppContent />} />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;