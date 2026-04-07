import { Link } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { posts } from '../../data/posts';
import { mockUsers } from '../../data/mockUsers';
import { IconDoc, IconMessage, IconUsers, IconCalendar, IconCheck, IconClose, IconHeart } from '../../components/icons';
import './AdminLayout.css';

const pendingUsers = mockUsers.filter(u => u.status === 'pending');

const stats = [
  { label: 'Total de Posts', value: posts.length, icon: <IconDoc size={28} />, color: '#d62828', link: '/admin/posts' },
  { label: 'Comentários', value: posts.reduce((sum, p) => sum + p.initialComments.length, 0), icon: <IconMessage size={28} />, color: '#2563eb', link: '/admin/comentarios' },
  { label: 'Usuários', value: mockUsers.length, icon: <IconUsers size={28} />, color: '#16a34a', link: '/admin/usuarios' },
  { label: 'Cadastros Pendentes', value: pendingUsers.length, icon: <IconCalendar size={28} />, color: '#f77f00', link: '/admin/usuarios' },
];

export function AdminDashboard() {
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
                <th>Data</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {pendingUsers.slice(0, 3).map(u => (
                <tr key={u.id}>
                  <td style={{ fontWeight: 600 }}>{u.name}</td>
                  <td>{u.email}</td>
                  <td>{u.date}</td>
                  <td style={{ display: 'flex', gap: 8 }}>
                    <button className="action-btn btn-approve" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <IconCheck size={14} /> Aprovar
                    </button>
                    <button className="action-btn btn-reject" style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
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
            {posts.slice(0, 5).map(post => (
              <tr key={post.id}>
                <td style={{ fontWeight: 600, maxWidth: 240 }}>{post.title}</td>
                <td>{post.author}</td>
                <td><span className="badge badge-active">{post.category}</span></td>
                <td style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                  <IconHeart size={16} color="#d62828" /> {post.initialLikes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}