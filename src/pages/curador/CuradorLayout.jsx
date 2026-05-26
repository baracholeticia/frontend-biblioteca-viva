import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { IconDoc, IconMenu, IconClose } from '../../components/icons';
import { logout } from '../../services/authService';
import '../admin/AdminLayout.css';

const IconLogout = ({ size = 20, color = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);

const navItems = [
    { path: '/curadoria/posts', label: 'Posts', icon: <IconDoc size={20} /> },
];

export function CuradorLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const confirmLogout = () => {
        setShowLogoutModal(false);
        logout();
        navigate('/login');
    };

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
                        <small>Curadoria</small>
                    </div>
                    <button className="admin-close-mobile" onClick={() => setSidebarOpen(false)}>
                        <IconClose size={24} color="#94a3b8" />
                    </button>
                </div>

                <nav className="admin-nav">
                    {navItems.map(item => {
                        const isActive = location.pathname.startsWith(item.path);
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                onClick={() => setSidebarOpen(false)}
                                className={`admin-nav-item ${isActive ? 'active' : ''}`}
                            >
                                <span style={{ display: 'flex', alignItems: 'center' }}>{item.icon}</span>
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="admin-sidebar-footer" style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    <button className="admin-back-btn" onClick={() => navigate('/')}>
                        Voltar ao Site
                    </button>
                    <button
                        className="admin-back-btn"
                        onClick={() => setShowLogoutModal(true)}
                        style={{ color: '#f87171', borderColor: 'rgba(248, 113, 113, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                    >
                        <IconLogout size={16} />
                        Deslogar
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <div className="admin-content">
                    {children}
                </div>
            </main>

            {showLogoutModal && (
                <div className="admin-modal-overlay">
                    <div className="admin-modal">
                        <h3 className="admin-modal-title">Sair do sistema</h3>
                        <p className="admin-modal-text">Tem certeza que deseja sair da sua conta?</p>
                        <div className="admin-modal-actions">
                            <button className="action-btn btn-view" onClick={() => setShowLogoutModal(false)} style={{ padding: '10px 16px', fontSize: '14px' }}>
                                Cancelar
                            </button>
                            <button className="action-btn btn-delete" onClick={confirmLogout} style={{ padding: '10px 16px', fontSize: '14px' }}>
                                Sim, sair
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}