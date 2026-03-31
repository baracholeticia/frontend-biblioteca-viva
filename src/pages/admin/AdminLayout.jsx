import { Link, useLocation, useNavigate } from 'react-router-dom';
import './AdminLayout.css';

const navItems = [
  { path: '/admin', label: 'Dashboard', icon: '📊' },
  { path: '/admin/posts', label: 'Posts', icon: '📝' },
  { path: '/admin/comentarios', label: 'Comentários', icon: '💬' },
  { path: '/admin/usuarios', label: 'Usuários', icon: '👥' },
];

export function AdminLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <div className="admin-wrapper">
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <span>📚</span>
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
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="admin-sidebar-footer">
          <button className="admin-back-btn" onClick={() => navigate('/')}>
            ← Voltar ao Site
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