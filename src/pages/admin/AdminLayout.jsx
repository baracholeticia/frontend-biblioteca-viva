import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IconDashboard, IconDoc, IconMessage, IconUsers, IconMenu, IconClose } from '../../components/icons';
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
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="admin-wrapper">
      
      <div className="admin-mobile-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <button className="admin-hamburger" onClick={() => setSidebarOpen(true)}>
            <IconMenu size={24} color="#fff" />
          </button>
          <span style={{ fontWeight: 700, fontSize: '16px', color: '#fcbf49' }}>BIBLIOTECA VIVA</span>
        </div>
      </div>

      {sidebarOpen && <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />}

      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-logo">
          <IconDoc size={28} color="#f0a500" />
          <div>
            <strong>Biblioteca Viva</strong>
            <small>Administração</small>
          </div>
          <button className="admin-close-mobile" onClick={() => setSidebarOpen(false)}>
            <IconClose size={24} color="#94a3b8" />
          </button>
        </div>
        
        <nav className="admin-nav">
          {navItems.map(item => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setSidebarOpen(false)}
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