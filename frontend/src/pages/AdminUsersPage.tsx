import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUsers } from '../hooks/UseUser';
import { updateUser } from '../services/api';
import type { CreateUserPayload, User } from '../types';

export function AdminUsersPage() {
  const { token } = useAuth();
  const { users, loading, error, addUser, refresh } = useUsers(token);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<CreateUserPayload>({ email: '', password: '', fullName: '' });
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editForm, setEditForm] = useState({ fullName: '', password: '' });
  const [editError, setEditError] = useState<string | null>(null);
  const [editSubmitting, setEditSubmitting] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async () => {
    if (!form.email || !form.password || !form.fullName) {
      setFormError('Todos los campos son obligatorios.'); return;
    }
    if (form.password.length < 6) {
      setFormError('Mínimo 6 caracteres.'); return;
    }
    setSubmitting(true); setFormError(null);
    const success = await addUser(form);
    if (success) { setForm({ email: '', password: '', fullName: '' }); setShowForm(false); }
    else setFormError('No se pudo crear el usuario.');
    setSubmitting(false);
  };

  const openEdit = (u: User) => {
    setEditingUser(u);
    setEditForm({ fullName: u.fullName, password: '' });
    setEditError(null);
    setShowEditPassword(false);
  };

  const handleEdit = async () => {
    if (!editForm.fullName || !editingUser) {
      setEditError('El nombre es obligatorio.'); return;
    }
    if (editForm.password && editForm.password.length < 6) {
      setEditError('Mínimo 6 caracteres.'); return;
    }
    setEditSubmitting(true); setEditError(null);
    try {
      await updateUser(editingUser.id, {
        fullName: editForm.fullName,
        password: editForm.password || undefined,
      }, token!);
      await refresh();
      setEditingUser(null);
    } catch {
      setEditError('No se pudo actualizar el usuario.');
    }
    setEditSubmitting(false);
  };

  const roleColor = (role: string) =>
    role === 'Bibliotecario' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700';

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Usuarios</h2>
          <p className="text-sm text-gray-500 mt-1">{users.length} usuarios registrados</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold rounded-xl cursor-pointer"
        >
          + Crear bibliotecario
        </button>
      </div>

      {/* Formulario crear */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 flex flex-col gap-4">
          <h3 className="text-base font-bold text-gray-800">Nuevo bibliotecario</h3>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Nombre completo', name: 'fullName', type: 'text', placeholder: 'Ana García' },
              { label: 'Correo electrónico', name: 'email', type: 'email', placeholder: 'ana@biblioteca.com' },
              { label: 'Contraseña', name: 'password', type: 'password', placeholder: 'Mínimo 6 caracteres' },
            ].map(({ label, name, type, placeholder }) => (
              <div key={name} className="flex flex-col gap-1">
                <label className="text-sm font-medium text-gray-700">{label}</label>
                <input
                  name={name} type={type}
                  value={form[name as keyof CreateUserPayload]}
                  onChange={handleChange} placeholder={placeholder}
                  className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>
            ))}
          </div>
          {formError && <p className="text-sm text-red-500">{formError}</p>}
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">Cancelar</button>
            <button onClick={handleSubmit} disabled={submitting}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-300 text-white text-sm font-semibold rounded-lg cursor-pointer">
              {submitting ? 'Guardando...' : 'Crear'}
            </button>
          </div>
        </div>
      )}

      {/* Modal editar */}
      {editingUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-800">Editar usuario</h3>
              <button onClick={() => setEditingUser(null)} className="text-gray-400 hover:text-gray-600 text-2xl cursor-pointer">×</button>
            </div>
            <p className="text-sm text-gray-500">{editingUser.email}</p>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Nombre completo</label>
              <input
                type="text" value={editForm.fullName}
                onChange={(e) => setEditForm((p) => ({ ...p, fullName: e.target.value }))}
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm font-medium text-gray-700">Nueva contraseña <span className="text-gray-400">(opcional)</span></label>
              <div className="relative">
                <input
                  type={showEditPassword ? 'text' : 'password'}
                  value={editForm.password}
                  onChange={(e) => setEditForm((p) => ({ ...p, password: e.target.value }))}
                  placeholder="Dejar vacío para no cambiar"
                  className="w-full px-3 py-2 pr-16 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                  type="button"
                  onClick={() => setShowEditPassword(!showEditPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-500 hover:text-blue-700 cursor-pointer font-medium"
                >
                  {showEditPassword ? 'Ocultar' : 'Ver'}
                </button>
              </div>
            </div>

            {editError && <p className="text-sm text-red-500">{editError}</p>}

            <div className="flex gap-3 justify-end">
              <button onClick={() => setEditingUser(null)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg cursor-pointer">Cancelar</button>
              <button onClick={handleEdit} disabled={editSubmitting}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-semibold rounded-lg cursor-pointer">
                {editSubmitting ? 'Guardando...' : 'Guardar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <div className="text-center py-12 text-gray-400 text-sm">Cargando usuarios...</div>}
      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">{error}</div>}

      {!loading && !error && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wide">
              <tr>
                <th className="px-6 py-4 text-left">Nombre</th>
                <th className="px-6 py-4 text-left">Correo</th>
                <th className="px-6 py-4 text-left">Rol</th>
                <th className="px-6 py-4 text-left">Registro</th>
                <th className="px-6 py-4 text-left">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {users.map((u) => (
                <tr key={u.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium text-gray-800">{u.fullName}</td>
                  <td className="px-6 py-4 text-gray-500">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${roleColor(u.role)}`}>{u.role}</span>
                  </td>
                  <td className="px-6 py-4 text-gray-400">{new Date(u.createdAt).toLocaleDateString('es-GT')}</td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => openEdit(u)}
                      className="px-3 py-1 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-medium rounded-lg cursor-pointer"
                    >
                      Editar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}