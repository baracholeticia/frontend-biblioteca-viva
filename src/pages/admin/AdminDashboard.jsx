import { useState, useEffect } from 'react';
import { AdminLayout } from './AdminLayout';
import { getAllUsers, approveUser, rejectUser, getDashboardData } from '../../services/adminService';
import { getAllWorks } from '../../services/workService';
import { useToast } from '../../context/ToastContext';
import { IconDoc, IconMessage, IconUsers, IconCalendar, IconCheck, IconClose, IconHeart } from '../../components/icons';
import { Link} from 'react-router-dom';
import './AdminLayout.css';

const ChevronIcon = ({ expanded }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const categoryTranslations = {
  'Essay': 'Redação Nota 10',
  'Cordel': 'Cordel',
  'Tale': 'Conto',
  'ShortStory': 'Crônica',
  'Article': 'Jornal da Escola',
  'Infographic': 'Infográfico',
  'Art': 'Arte',
  'Multimedia': 'Vídeo Autoral',
  'LibraLiterature': 'Literatura em Libras',
  'Poem': 'Poema',
  'BookClub': 'Clube de Leitura'
};

export function AdminDashboard() {
  const [stats, setStats] = useState({ totalPosts: 0, totalComments: 0, totalUsers: 0, pendingUsers: 0 });
  const [pendingUsersList, setPendingUsersList] = useState([]);
  const [recentWorks, setRecentWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedUserId, setExpandedUserId] = useState(null);
  const [expandedPostId, setExpandedPostId] = useState(null);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        setLoading(true);
        const dashboardStats = await getDashboardData();
        setStats(dashboardStats);
        const [pendingData, worksData] = await Promise.all([ getAllUsers('pending', 0, 5), getAllWorks(null, 5) ]);
        setPendingUsersList(pendingData || []);
        setRecentWorks(worksData || []);
      } catch (error) {
        console.error(error); 
        showToast("Erro ao carregar dados. Você tem permissão de Admin?", "error");
      } finally { 
        setLoading(false); 
      }
    }
    fetchDashboardData();
  }, [showToast]);

  const handleApprove = async (id) => {
    try { 
      await approveUser(id); 
      showToast("Aprovado!", "success"); 
      setPendingUsersList(pendingUsersList.filter(u => u.id !== id)); 
      setStats(s => ({ ...s, pendingUsers: s.pendingUsers - 1, totalUsers: s.totalUsers + 1 })); 
    } catch (error) { 
      console.error(error); 
      showToast("Erro ao aprovar.", "error"); 
    }
  };

  const handleReject = async (id) => {
    try { 
      await rejectUser(id); 
      showToast("Rejeitado.", "success"); 
      setPendingUsersList(pendingUsersList.filter(u => u.id !== id)); 
      setStats(s => ({ ...s, pendingUsers: s.pendingUsers - 1 })); 
    } catch (error) { 
      console.error(error); 
      showToast("Erro ao rejeitar.", "error"); 
    }
  };

  const statCards = [
    { label: 'Total de Posts', value: stats.totalPosts || 0, icon: <IconDoc size={24} />, color: '#d62828', link: '/admin/posts' },
    { label: 'Comentários', value: stats.totalComments || 0, icon: <IconMessage size={24} />, color: '#2563eb', link: '/admin/comentarios' },
    { label: 'Usuários', value: stats.totalUsers || 0, icon: <IconUsers size={24} />, color: '#16a34a', link: '/admin/usuarios' },
    { label: 'Pendentes', value: stats.pendingUsers || 0, icon: <IconCalendar size={24} />, color: '#f77f00', link: '/admin/usuarios' },
  ];

  if (loading) return <AdminLayout><h1 className="admin-page-title">Carregando painel...</h1></AdminLayout>;

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Painel de Administração</h1>
      
      <div className="admin-stats-grid">
        {statCards.map(stat => (
          <Link to={stat.link} key={stat.label} style={{ textDecoration: 'none' }}>
            <div className="admin-stat-card" style={{ borderLeftColor: stat.color }}>
              <div className="admin-stat-icon" style={{ color: stat.color }}>{stat.icon}</div>
              <div className="admin-stat-value" style={{ color: stat.color }}>{stat.value}</div>
              <div className="admin-stat-label">{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {pendingUsersList.length > 0 && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div className="admin-card-header">
            <h2><IconCalendar size={18} /> Cadastros Pendentes</h2>
            <Link to="/admin/usuarios" className="admin-link-ver-todos">Ver todos →</Link>
          </div>
          <table className="admin-table">
            <thead><tr><th>Nome</th><th className="desktop-cell">E-mail</th><th className="desktop-cell">Ações</th></tr></thead>
            <tbody>
              {pendingUsersList.slice(0, 3).map(u => (
                <tr key={u.id}>
                  <td>
                    <div className="row-header" onClick={() => setExpandedUserId(prev => prev === u.id ? null : u.id)}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 600 }} className="truncate-text">{u.name}</div>
                        <div className="mobile-expanded-content" style={{ display: expandedUserId === u.id ? 'none' : 'block', marginTop: 2, padding: 0, border: 'none', color: '#6b778c', fontSize: 12 }}>{u.email}</div>
                      </div>
                      <button className="mobile-expand-btn"><ChevronIcon expanded={expandedUserId === u.id} /></button>
                    </div>
                    {expandedUserId === u.id && (
                      <div className="mobile-expanded-content">
                        <p><strong>E-mail:</strong> {u.email}</p>
                        <div className="admin-table-actions" style={{ marginTop: 12 }}>
                          <button className="action-btn btn-approve" onClick={() => handleApprove(u.id)}><IconCheck size={14} /> <span className="action-text">Aprovar</span></button>
                          <button className="action-btn btn-reject" onClick={() => handleReject(u.id)}><IconClose size={14} /> <span className="action-text">Rejeitar</span></button>
                        </div>
                      </div>
                    )}
                  </td>
                  <td className="desktop-cell">{u.email}</td>
                  <td className="desktop-cell">
                    <div className="admin-table-actions">
                      <button className="action-btn btn-approve" onClick={() => handleApprove(u.id)}><IconCheck size={14} /> <span className="action-text">Aprovar</span></button>
                      <button className="action-btn btn-reject" onClick={() => handleReject(u.id)}><IconClose size={14} /> <span className="action-text">Rejeitar</span></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-card-header">
          <h2><IconDoc size={18} /> Posts Recentes</h2>
          <Link to="/admin/posts" className="admin-link-ver-todos">Ver todos →</Link>
        </div>
        <table className="admin-table">
          <thead><tr><th>Título</th><th className="desktop-cell">Autor</th><th className="desktop-cell">Categoria</th><th className="desktop-cell">Curtidas</th></tr></thead>
          <tbody>
            {recentWorks.slice(0, 5).map(post => (
              <tr key={post.id}>
                <td>
                  <div className="row-header" onClick={() => setExpandedPostId(prev => prev === post.id ? null : post.id)}>
                    <span style={{ fontWeight: 600 }} className="truncate-text">{post.title}</span>
                    <button className="mobile-expand-btn"><ChevronIcon expanded={expandedPostId === post.id} /></button>
                  </div>
                  {expandedPostId === post.id && (
                    <div className="mobile-expanded-content">
                      <p><strong>Autor:</strong> {post.author}</p>
                      <p><strong>Categoria:</strong> <span className="badge badge-active">{categoryTranslations[post.type] || post.type}</span></p>
                      <p><strong>Curtidas:</strong> {post.likeCount || 0}</p>
                    </div>
                  )}
                </td>
                <td className="desktop-cell">{post.author}</td>
                <td className="desktop-cell"><span className="badge badge-active">{categoryTranslations[post.type] || post.type}</span></td>
                <td className="desktop-cell"><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconHeart size={14} color="#d62828" /> {post.likeCount || 0}</div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}