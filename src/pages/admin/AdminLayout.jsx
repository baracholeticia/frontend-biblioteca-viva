import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IconDashboard, IconDoc, IconMessage, IconUsers } from '../../components/icons';
import './AdminLayout.css';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: <IconDashboard size={20} /> },
  { path: '/admin/posts', label: 'Posts', icon: <IconDoc size={20} /> },
  { path: '/admin/comentarios', label: 'Comentários', icon: <IconMessage size={20} /> },
  { path: '/admin/usuarios', label: 'Usuários', icon: <IconUsers size={20} /> },
];

export function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <IconDoc size={28} color="#f0a500" />
          <div>
            <strong>Biblioteca Viva</strong>
            <small>Painel Admin</small>
          </div>
        </div>
        <nav className="admin-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              className={`admin-nav-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-back-btn" onClick={() => navigate('/')}>
            Voltar ao Site
          </button>
        </div>
      </aside>
      <main className="admin-main">
        <div className="admin-content">
          {children}
        </div>
      </main>
    </div>
  );
}