import { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from './AdminLayout';
import { useToast } from '../../context/ToastContext';
import { IconTrash, IconSearch, IconPlus } from '../../components/icons';
import { Pagination } from '../../components/pagination/Pagination';
import { getStaff, createStaff, deleteStaff } from '../../services/adminService'; 
import './AdminLayout.css';

const initialForm = { name: '', email: '', password: '', role: 'CURADOR' };

// Atualizado para as chaves em maiúsculo, como vem do backend
const roleTranslations = {
  'ADMIN': 'Administrador',
  'CURADOR': 'Curador'
};

const labelStyle = { fontSize: 13, fontWeight: 600, color: '#42526e' };
const inputStyle = { padding: '10px 14px', border: '1px solid #dfe1e6', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#0a2a57', width: '100%', boxSizing: 'border-box' };

export function AdminStaff() {
  const [staffList, setStaffList] = useState([]);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const { showToast } = useToast();

  // Pegamos o e-mail do usuário logado (ajuste caso você guarde com outro nome no localStorage)
  const currentUserEmail = localStorage.getItem('email') || localStorage.getItem('userEmail') || '';

  const fetchStaff = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getStaff(); 
      
      let sortedData = [...(data || [])];
      
      // Ordenação: Se for o usuário logado, joga para o topo da lista
      sortedData.sort((a, b) => {
        if (a.email === currentUserEmail) {
          return -1;
        } else if (b.email === currentUserEmail) {
          return 1;
        } else {
          return 0;
        }
      });

      setStaffList(sortedData);
    } catch (error) {
      console.error(error);
      showToast("Erro ao carregar equipe.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast, currentUserEmail]);

  useEffect(() => { fetchStaff(); }, [fetchStaff]);

  let filtered = staffList.filter(user => {
    let matchesSearch = false;
    
    if (user.name && user.name.toLowerCase().includes(search.toLowerCase())) {
        matchesSearch = true;
    } else if (user.email && user.email.toLowerCase().includes(search.toLowerCase())) {
        matchesSearch = true;
    }

    return matchesSearch;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePerPageChange = (value) => { setPerPage(value); setCurrentPage(1); };

  const startCreate = () => { setCreating(true); setForm(initialForm); };

  const handleSave = async () => {
    if (!form.name || !form.email || !form.password) {
      showToast("Preencha todos os campos obrigatórios.", "error");
      return;
    }

    try {
      await createStaff(form);
      showToast(`${roleTranslations[form.role]} criado com sucesso!`, "success");
      setCreating(false);
      fetchStaff();
    } catch (error) {
      console.error(error);
      showToast(`Erro ao criar membro da equipe.`, "error");
    }
  };

  const handleDelete = async (user) => {
    // Trava de segurança para impedir que o usuário delete a si mesmo
    if (user.email === currentUserEmail) {
        showToast("Ação não permitida: Você não pode remover sua própria conta.", "warning");
        return;
    }

    if (window.confirm(`Tem certeza que deseja remover ${user.name} da equipe?`)) {
      try {
        await deleteStaff(user.id);
        showToast("Membro removido com sucesso.", "success");
        fetchStaff();
      } catch (error) {
        console.error(error);
        showToast("Erro ao remover membro.", "error");
      }
    }
  };

  return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
          <div>
            <h1 className="admin-page-title">Equipe</h1>
            <p className="admin-page-subtitle">Gerencie os Administradores e Curadores do sistema</p>
          </div>
          <button className="action-btn btn-primary" onClick={startCreate} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <IconPlus size={16} /> <span className="action-text">Novo Membro</span>
          </button>
        </div>

        {creating && (
            <div className="admin-card" style={{ marginBottom: 24, borderLeft: '4px solid #16a34a' }}>
              <h2 style={{ color: '#0a2a57', fontSize: 17, fontWeight: 700, marginBottom: 20 }}>Adicionar Membro à Equipe</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={labelStyle}>Função (Role)</label>
                  <select style={inputStyle} value={form.role} onChange={e => setForm({ ...form, role: e.target.value })}>
                    <option value="CURADOR">Curador</option>
                    <option value="ADMIN">Administrador</option>
                  </select>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={labelStyle}>Nome Completo</label>
                  <input style={inputStyle} placeholder="Nome" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={labelStyle}>E-mail</label>
                  <input type="email" style={inputStyle} placeholder="exemplo@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={labelStyle}>Senha Provisória</label>
                  <input type="password" style={inputStyle} placeholder="Senha" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                <button className="action-btn btn-primary" onClick={handleSave} style={{ background: '#16a34a' }}>Salvar Cadastro</button>
                <button className="action-btn btn-view" onClick={() => setCreating(false)}>Cancelar</button>
              </div>
            </div>
        )}

        <div className="admin-card">
          <div className="admin-controls-bar">
            <div className="admin-search-input">
              <IconSearch size={18} color="#6b778c" />
              <input
                  style={{ border: 'none', padding: '10px 0', fontSize: 14, width: '100%', outline: 'none' }}
                  placeholder="Buscar por nome ou e-mail..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
              />
            </div>
          </div>

          <table className="admin-table">
            <thead>
            <tr>
              <th>Nome</th>
              <th className="desktop-cell">E-mail</th>
              <th className="desktop-cell">Função</th>
              <th className="desktop-cell">Ações</th>
            </tr>
            </thead>
            <tbody>
            {loading && (
                <tr><td colSpan="4" style={{textAlign:'center'}}>Carregando equipe...</td></tr>
            )}
            
            {!loading && filtered.length === 0 && (
                <tr><td colSpan="4" style={{textAlign:'center'}}>Nenhum membro encontrado.</td></tr>
            )}

            {!loading && paginated.map(user => {
                let isMe = false;
                if (user.email === currentUserEmail) {
                    isMe = true;
                }

                let rowStyle = {};
                if (isMe) {
                    rowStyle = { backgroundColor: '#f0f7ff' }; 
                }

                let roleBadgeClass = '';
                if (user.role === 'ADMIN') {
                    roleBadgeClass = 'badge badge-approved';
                } else {
                    roleBadgeClass = 'badge badge-active';
                }

                return (
                    <tr key={user.id} style={rowStyle}>
                      <td>
                        <div style={{ fontWeight: 600, color: '#0a2a57', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            {user.name}
                            {isMe && (
                                <span style={{ fontSize: 10, background: '#0052cc', color: 'white', padding: '2px 6px', borderRadius: 4 }}>
                                    VOCÊ
                                </span>
                            )}
                        </div>
                        <div className="mobile-expanded-content" style={{ display: 'block', padding: 0, marginTop: 4, border: 'none', color: '#6b778c' }}>
                          <span className={roleBadgeClass} style={{ fontSize: 10, marginRight: 6 }}>
                            {roleTranslations[user.role] || user.role}
                          </span>
                          {user.email}
                        </div>
                      </td>
                      <td className="desktop-cell">{user.email}</td>
                      <td className="desktop-cell">
                        <span className={roleBadgeClass}>
                          {roleTranslations[user.role] || user.role}
                        </span>
                      </td>
                      <td className="desktop-cell">
                        <div className="admin-table-actions">
                          {isMe && (
                              <button className="action-btn" style={{ opacity: 0.5, cursor: 'not-allowed' }} disabled>
                                <IconTrash size={14} /> <span className="action-text">Remover</span>
                              </button>
                          )}
                          
                          {!isMe && (
                              <button className="action-btn btn-delete" onClick={() => handleDelete(user)}>
                                <IconTrash size={14} /> <span className="action-text">Remover</span>
                              </button>
                          )}
                        </div>
                      </td>
                    </tr>
                );
            })}
            </tbody>
          </table>

          <Pagination
              currentPage={safePage}
              totalPages={totalPages}
              totalItems={filtered.length}
              perPage={perPage}
              onPageChange={handlePageChange}
              onPerPageChange={handlePerPageChange}
          />
        </div>
      </AdminLayout>
  );
}