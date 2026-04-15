import { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from './AdminLayout';
import { getAllUsers, approveUser, rejectUser, blockUser } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { IconSearch, IconCheck, IconClose } from '../../components/icons';
import './AdminLayout.css';

const statusBadges = { pending: 'badge-pending', active: 'badge-approved', rejected: 'badge-rejected', blocked: 'badge-rejected' };
const statusLabels = { pending: 'Pendente', active: 'Ativo', rejected: 'Rejeitado', blocked: 'Bloqueado' };

export function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all'); 
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error("Erro ao buscar usuários", error);
      showToast("Erro ao buscar usuários. Verifique sua conexão ou token de administrador.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const filtered = users.filter(u => {
    const statusMatch = filter === 'approved' ? u.accountStatus === 'active' : u.accountStatus;
    const matchFilter = filter === 'all' || statusMatch === filter;
    
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase());
      
    return matchFilter && matchSearch;
  });

  const handleUpdateStatus = async (id, action) => {
    try {
      if (action === 'approve') {
        await approveUser(id);
        showToast("Usuário aprovado e ativado!", "success");
      }
      if (action === 'reject') {
        await rejectUser(id);
        showToast("Usuário rejeitado.", "success");
      }
      if (action === 'block') {
        await blockUser(id);
        showToast("Usuário bloqueado.", "success");
      }
      
      fetchUsers();
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      showToast("Erro ao atualizar status do usuário.", "error");
    }
  };

  const pendingCount = users.filter(u => u.accountStatus === 'pending').length;

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Usuários</h1>
      <p className="admin-page-subtitle">{users.length} usuários cadastrados · {pendingCount} pendentes</p>

      <div className="admin-card">
        <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #dfe1e6', borderRadius: 8, padding: '0 14px', width: 280 }}>
            <IconSearch size={18} color="#6b778c" />
            <input
              style={{ padding: '10px 14px', border: 'none', fontSize: 14, width: '100%', outline: 'none' }}
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
                  background: filter === f ? '#0a2a57' : '#f0f2f5',
                  color: filter === f ? 'white' : '#42526e',
                }}
              >
                {f === 'all' ? 'Todos' : f === 'pending' ? `Pendentes (${pendingCount})` : f === 'approved' ? 'Ativos' : 'Rejeitados/Bloqueados'}
              </button>
            ))}
          </div>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>E-mail</th>
              <th>Perfil (Role)</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Carregando usuários...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Nenhum usuário encontrado.</td></tr>
            ) : (
              filtered.map(user => (
                <tr key={user.id}>
                  <td style={{ fontWeight: 600 }}>{user.name}</td>
                  <td style={{ color: '#6b778c', fontSize: 13 }}>{user.email}</td>
                  <td><span className="badge badge-student">{user.role}</span></td>
                  <td>
                    <span className={`badge ${statusBadges[user.accountStatus]}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {user.accountStatus === 'active' && <IconCheck size={12}/>}
                      {user.accountStatus === 'rejected' && <IconClose size={12}/>}
                      {statusLabels[user.accountStatus] || user.accountStatus}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                      {user.accountStatus === 'pending' && (
                        <>
                          <button className="action-btn btn-approve" onClick={() => handleUpdateStatus(user.id, 'approve')} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            <IconCheck size={14}/> Aprovar
                          </button>
                          <button className="action-btn btn-reject" onClick={() => handleUpdateStatus(user.id, 'reject')} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                            <IconClose size={14}/> Rejeitar
                          </button>
                        </>
                      )}
                      {user.accountStatus === 'active' && (
                        <button className="action-btn btn-reject" onClick={() => handleUpdateStatus(user.id, 'block')}>Bloquear</button>
                      )}
                      {user.accountStatus === 'blocked' && (
                        <button className="action-btn btn-approve" onClick={() => handleUpdateStatus(user.id, 'approve')}>Desbloquear</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}