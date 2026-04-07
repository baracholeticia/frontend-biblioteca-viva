import { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { mockUsers as initialUsers } from '../../data/mockUsers';
import { IconSearch, IconCheck, IconClose, IconTrash } from '../../components/icons';
import './AdminLayout.css';

const statusBadges = { pending: 'badge-pending', approved: 'badge-approved', rejected: 'badge-rejected' };
const statusLabels = { pending: 'Pendente', approved: 'Aprovado', rejected: 'Rejeitado' };

export function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [filter, setFilter] = useState('all'); // all | pending | approved
  const [search, setSearch] = useState('');

  const filtered = users.filter(u => {
    const matchFilter = filter === 'all' || u.status === filter;
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const updateStatus = (id, status) => {
    setUsers(users.map(u => u.id === id ? { ...u, status } : u));
  };

  const deleteUser = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este usuário?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const pendingCount = users.filter(u => u.status === 'pending').length;

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Usuários</h1>
      <p className="admin-page-subtitle">{users.length} usuários cadastrados · {pendingCount} pendentes</p>

      <div className="admin-card">
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #dfe1e6', borderRadius: 8, padding: '0 14px', width: 280 }}>
            <IconSearch size={18} color="#6b778c" />
            <input
              style={{ ...inputStyle, border: 'none', padding: '10px 0', width: '100%', outline: 'none' }}
              placeholder="Buscar por nome ou e-mail..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: '8px 16px',
                  borderRadius: 8,
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 600,
                  fontFamily: 'inherit',
                  background: filter === f ? '#0a2a57' : '#f0f2f5',
                  color: filter === f ? 'white' : '#42526e',
                }}
              >
                {f === 'all' ? 'Todos' : f === 'pending' ? `Pendentes (${pendingCount})` : f === 'approved' ? 'Aprovados' : 'Rejeitados'}
              </button>
            ))}
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Perfil</th>
              <th>Status</th>
              <th>Cadastro</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(user => (
              <tr key={user.id}>
                <td style={{ fontWeight: 600 }}>{user.name}</td>
                <td style={{ color: '#6b778c', fontSize: 13 }}>{user.email}</td>
                <td>
                  <span className={`badge ${statusBadges[user.status]}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    {user.status === 'approved' && <IconCheck size={12}/>}
                    {user.status === 'rejected' && <IconClose size={12}/>}
                    {statusLabels[user.status]}
                  </span>
                </td>
                <td style={{ color: '#6b778c', fontSize: 13 }}>{user.date}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                    {user.status === 'pending' && (
                      <>
                        <button className="action-btn btn-approve" onClick={() => updateStatus(user.id, 'approved')} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                          <IconCheck size={14}/> Aprovar
                        </button>
                        <button className="action-btn btn-reject" onClick={() => updateStatus(user.id, 'rejected')} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                          <IconClose size={14}/> Rejeitar
                        </button>
                      </>
                    )}
                    {user.status === 'approved' && (
                      <button className="action-btn btn-reject" onClick={() => updateStatus(user.id, 'rejected')}>Bloquear</button>
                    )}
                    {user.status === 'rejected' && (
                      <button className="action-btn btn-approve" onClick={() => updateStatus(user.id, 'approved')}>Reativar</button>
                    )}
                    <button className="action-btn btn-delete" onClick={() => deleteUser(user.id)} style={{ display: 'flex', padding: 6 }}>
                      <IconTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', padding: '30px 0', color: '#6b778c' }}>Nenhum usuário encontrado.</p>
        )}
      </div>
    </AdminLayout>
  );
}

const inputStyle = {
  fontSize: 14,
  fontFamily: 'inherit',
  color: '#0a2a57',
  boxSizing: 'border-box',
};