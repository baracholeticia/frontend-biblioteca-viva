import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { getAllUsers, approveUser, rejectUser } from '../../services/adminService';
import { getAllWorks } from '../../services/workService';
import { useToast } from '../../context/ToastContext';
import { IconDoc, IconMessage, IconUsers, IconCalendar, IconCheck, IconClose, IconHeart } from '../../components/icons';
import './AdminLayout.css';

export function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const [usersData, worksData] = await Promise.all([
          getAllUsers(),
          getAllWorks()
        ]);
        setUsers(usersData);
        setWorks(worksData);
      } catch (error) {
        console.error("Erro ao carregar dashboard:", error);
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
      showToast("Usuário aprovado com sucesso!", "success");
      setUsers(users.map(u => u.id === id ? { ...u, accountStatus: 'active' } : u));
    } catch (error) {
      console.error("Erro ao aprovar:", error); 
      showToast("Erro ao aprovar usuário.", "error");
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectUser(id);
      showToast("Usuário rejeitado.", "success");
      setUsers(users.map(u => u.id === id ? { ...u, accountStatus: 'rejected' } : u));
    } catch (error) {
      console.error("Erro ao rejeitar:", error); 
      showToast("Erro ao rejeitar usuário.", "error");
    }
  };

  const pendingUsers = users.filter(u => u.accountStatus === 'pending');
  const totalComments = works.reduce((sum, w) => sum + (w.commentCount || 0), 0);

  const stats = [
    { label: 'Total de Posts', value: works.length, icon: <IconDoc size={28} />, color: '#d62828', link: '/admin/posts' },
    { label: 'Comentários', value: totalComments, icon: <IconMessage size={28} />, color: '#2563eb', link: '/admin/comentarios' },
    { label: 'Usuários', value: users.length, icon: <IconUsers size={28} />, color: '#16a34a', link: '/admin/usuarios' },
    { label: 'Pendentes', value: pendingUsers.length, icon: <IconCalendar size={28} />, color: '#f77f00', link: '/admin/usuarios' },
  ];

  if (loading) {
    return <AdminLayout><h1 className="admin-page-title">Carregando painel...</h1></AdminLayout>;
  }

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Painel de Administração</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
        {stats.map(stat => (
          <Link to={stat.link} key={stat.label} style={{ textDecoration: 'none' }}>
            <div className="admin-card" style={{ borderLeft: `4px solid ${stat.color}`, cursor: 'pointer', transition: 'transform 0.2s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-3px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >
              <div style={{ marginBottom: 8, color: stat.color }}>{stat.icon}</div>
              <div style={{ fontSize: 32, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              <div style={{ fontSize: 13, color: '#6b778c', fontWeight: 500 }}>{stat.label}</div>
            </div>
          </Link>
        ))}
      </div>

      {pendingUsers.length > 0 && (
        <div className="admin-card" style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h2 style={{ color: '#0a2a57', fontSize: 18, fontWeight: 700, display: 'flex', gap: 8, alignItems: 'center' }}>
              <IconCalendar size={20} /> Cadastros Pendentes
            </h2>
            <Link to="/admin/usuarios" style={{ color: '#d62828', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Ver todos →</Link>
          </div>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>E-mail</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.slice(0, 3).map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="action-btn btn-approve" onClick={() => handleApprove(u.id)} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <IconCheck size={14} /> Aprovar
                    </button>
                    <button className="action-btn btn-reject" onClick={() => handleReject(u.id)} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <IconClose size={14} /> Rejeitar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="admin-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
          <h2 style={{ color: '#0a2a57', fontSize: 18, fontWeight: 700, display: 'flex', gap: 8, alignItems: 'center' }}>
            <IconDoc size={20} /> Posts Recentes
          </h2>
          <Link to="/admin/posts" style={{ color: '#d62828', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Ver todos →</Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Categoria</th>
              <th>Curtidas</th>
            </tr>
          </thead>
          <tbody>
            {works.slice(0, 5).map(post => (
              <tr key={post.id}>
                <td style={{ fontWeight: 600, maxWidth: 240 }}>{post.title}</td>
                <td>{post.author}</td>
                <td><span className="badge badge-active">{post.type}</span></td>
                <td style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <IconHeart size={16} color="#d62828" /> {post.likeCount || 0}
                </td>
              </tr>
            ))}
            {works.length === 0 && (
              <tr><td colSpan="4" style={{textAlign:'center', padding:20}}>Nenhum post encontrado.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}