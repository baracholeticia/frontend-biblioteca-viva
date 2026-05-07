import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { getAllUsers, approveUser, rejectUser, blockUser } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { IconSearch, IconCheck, IconClose, IconEye } from '../../components/icons';
import './AdminLayout.css';

const ChevronIcon = ({ expanded }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const statusBadges = { pending: 'badge-pending', active: 'badge-approved', rejected: 'badge-rejected', blocked: 'badge-rejected' };
const statusLabels = { pending: 'Pendente', active: 'Ativo', rejected: 'Rejeitado', blocked: 'Bloqueado' };

export function AdminUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState('all'); 
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const { showToast } = useToast();

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(data);
    } catch (error) {
      console.error(error); // Variável 'error' utilizada!
      showToast("Erro ao buscar usuários. Verifique sua conexão.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const filtered = users.filter(u => {
    const currentStatus = u.status || u.accountStatus || 'pending';
    let statusMatch = true;
    if (filter === 'pending') statusMatch = currentStatus === 'pending';
    if (filter === 'approved') statusMatch = currentStatus === 'active';
    if (filter === 'rejected') statusMatch = (currentStatus === 'rejected' || currentStatus === 'blocked');
    const matchSearch = u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    return statusMatch && matchSearch;
  });

  const handleUpdateStatus = async (id, action) => {
    try {
      if (action === 'approve') { await approveUser(id); showToast("Usuário aprovado e ativado!", "success"); }
      if (action === 'reject') { await rejectUser(id); showToast("Usuário rejeitado.", "success"); }
      if (action === 'block') { await blockUser(id); showToast("Usuário bloqueado.", "success"); }
      fetchUsers();
    } catch (error) {
      console.error(error); // Variável 'error' utilizada!
      showToast("Erro ao atualizar status do usuário.", "error");
    }
  };

  const pendingCount = users.filter(u => (u.status || u.accountStatus) === 'pending').length;

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Usuários</h1>
      <p className="admin-page-subtitle">{users.length} usuários cadastrados · {pendingCount} pendentes</p>

      <div className="admin-card">
        {/* FILTROS MENU SUSPENSO E BUSCA */}
        <div className="admin-controls-bar">
          <div className="admin-search-input">
            <IconSearch size={18} color="#6b778c" />
            <input 
              style={{ border: 'none', padding: '10px 0', fontSize: 14, width: '100%', outline: 'none' }} 
              placeholder="Buscar nome ou e-mail..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>
          
          <select className="admin-select" value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">Todos os Usuários</option>
            <option value="pending">Pendentes ({pendingCount})</option>
            <option value="approved">Ativos</option>
            <option value="rejected">Rejeitados/Bloqueados</option>
          </select>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th className="desktop-cell">E-mail</th>
              <th className="desktop-cell">Perfil</th>
              <th className="desktop-cell">Status</th>
              <th className="desktop-cell">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Carregando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Nenhum usuário encontrado.</td></tr>
            ) : (
              filtered.map(user => {
                const status = user.status || user.accountStatus || 'pending';
                return (
                <tr key={user.id}>
                  <td>
                    <div className="row-header" onClick={() => toggleExpand(user.id)}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, color: '#0a2a57' }}>{user.name}</div>
                        <div style={{ color: '#6b778c', fontSize: 12 }}>{user.email}</div>
                      </div>
                      <button className="mobile-expand-btn"><ChevronIcon expanded={expandedId === user.id} /></button>
                    </div>

                    {expandedId === user.id && (
                      <div className="mobile-expanded-content">
                        <p><strong>Perfil:</strong> <span className="badge badge-student">{user.role}</span></p>
                        <p><strong>Status:</strong> <span className={`badge ${statusBadges[status]}`}>{statusLabels[status] || status}</span></p>
                        <div className="admin-table-actions" style={{ marginTop: 12 }}>
                          {status !== 'pending' && (
                            <button className="action-btn btn-view" onClick={() => navigate(`/autor/${encodeURIComponent(user.name)}`)}>
                              <IconEye size={14}/> <span className="action-text">Ver Perfil</span>
                            </button>
                          )}
                          {status === 'pending' && (
                            <>
                              <button className="action-btn btn-approve" onClick={() => handleUpdateStatus(user.id, 'approve')}><IconCheck size={14}/> <span className="action-text">Aprovar</span></button>
                              <button className="action-btn btn-reject" onClick={() => handleUpdateStatus(user.id, 'reject')}><IconClose size={14}/> <span className="action-text">Rejeitar</span></button>
                            </>
                          )}
                          {status === 'active' && <button className="action-btn btn-reject" onClick={() => handleUpdateStatus(user.id, 'block')}><IconClose size={14}/> <span className="action-text">Bloquear</span></button>}
                          {status === 'blocked' && <button className="action-btn btn-approve" onClick={() => handleUpdateStatus(user.id, 'approve')}><IconCheck size={14}/> <span className="action-text">Desbloquear</span></button>}
                        </div>
                      </div>
                    )}
                  </td>

                  <td className="desktop-cell" style={{ color: '#6b778c', fontSize: 13 }}>{user.email}</td>
                  <td className="desktop-cell"><span className="badge badge-student">{user.role}</span></td>
                  <td className="desktop-cell">
                    <span className={`badge ${statusBadges[status]}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                      {status === 'active' && <IconCheck size={12}/>}{status === 'rejected' && <IconClose size={12}/>}{statusLabels[status] || status}
                    </span>
                  </td>
                  <td className="desktop-cell">
                    <div className="admin-table-actions">
                      {status !== 'pending' && (
                        <button className="action-btn btn-view" onClick={() => navigate(`/autor/${encodeURIComponent(user.name)}`)}><IconEye size={14}/> <span className="action-text">Ver</span></button>
                      )}
                      {status === 'pending' && (
                        <><button className="action-btn btn-approve" onClick={() => handleUpdateStatus(user.id, 'approve')}><IconCheck size={14}/> <span className="action-text">Aprovar</span></button><button className="action-btn btn-reject" onClick={() => handleUpdateStatus(user.id, 'reject')}><IconClose size={14}/> <span className="action-text">Rejeitar</span></button></>
                      )}
                      {status === 'active' && <button className="action-btn btn-reject" onClick={() => handleUpdateStatus(user.id, 'block')}><IconClose size={14}/> <span className="action-text">Bloquear</span></button>}
                      {status === 'blocked' && <button className="action-btn btn-approve" onClick={() => handleUpdateStatus(user.id, 'approve')}><IconCheck size={14}/> <span className="action-text">Desbloquear</span></button>}
                    </div>
                  </td>
                </tr>
              )})
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}