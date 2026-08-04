import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
// Importe a função de logout do seu authService
import { logout } from '../../services/authService';
import {
  IconBook, IconUser, IconMenu, IconClose,
  IconAward, IconScrollText, IconDoc, IconFeather,
  IconBookmark, IconNewspaper, IconBarChart, IconPalette,
  IconVideo, IconGlobe, IconPencil, IconDashboard
} from '../icons';
import './Header.css';

const sections = [
  { label: 'Redações Nota 10',     key: 'redacoes',      icon: <IconAward size={20} /> },
  { label: 'Cordéis',              key: 'cordeis',       icon: <IconScrollText size={20} /> },
  { label: 'Contos',               key: 'contos',        icon: <IconDoc size={20} /> },
  { label: 'Crônicas',             key: 'cronicas',      icon: <IconFeather size={20} /> },
  { label: 'Poemas',               key: 'poemas',        icon: <IconPencil size={20} /> },
  { label: 'Clube de Leitura',     key: 'clube-leitura', icon: <IconBookmark size={20} /> },
  { label: 'Jornal da Escola',     key: 'jornal',        icon: <IconNewspaper size={20} /> },
  { label: 'Infográficos',         key: 'infograficos',  icon: <IconBarChart size={20} /> },
  { label: 'Galeria de Artes',     key: 'artes',         icon: <IconPalette size={20} /> },
  { label: 'Vídeos Autorais',      key: 'videos',        icon: <IconVideo size={20} /> },
  { label: 'Literatura em Libras', key: 'libras',        icon: <IconGlobe size={20} /> },
];

export function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;

  const role = useMemo(() => {
    if (!token) return '';
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.role || payload.roles || '';
    // eslint-disable-next-line no-unused-vars
    } catch (e) {
      return '';
    }
  }, [token]);

  const isAdmin = role.includes('ADMIN');
  const isCurador = role.includes('CURADOR');

  const activeSection = location.pathname.startsWith('/categoria/')
      ? location.pathname.split('/')[2]
      : null;

  const handleSection = (key) => {
    navigate(`/categoria/${key}`);
    setMenuOpen(false);
  };

  const handleProfileClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    } else if (isAdmin) {
      navigate('/admin');
    } else if (isCurador) {
      navigate('/curador');
    } else {
      navigate('/perfil');
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
      setMenuOpen(false);
    } catch (error) {
      console.error("Erro ao fazer logout", error);
    }
  };

  return (
      <>
        <header>
          <nav className="topbar">
            <div className="logo" onClick={() => { navigate('/'); setMenuOpen(false); }} style={{ cursor: 'pointer' }}>
              <span className="logo__icon"><IconBook size={22} color="#f0a500" /></span>
              <div className="logo__text-group">
                <span className="logo__title">BIBLIOTECA VIVA</span>
                <span className="logo__subtitle">EREM Abílio Monteiro</span>
              </div>
            </div>

            <div className="icons" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isAdmin && (
                  <button className="desktop-admin-btn" onClick={() => navigate('/admin')}>
                    Admin
                  </button>
              )}

              {isCurador && (
                  <button className="desktop-admin-btn" onClick={() => navigate('/curador')}>
                    Curador
                  </button>
              )}

              {!isAdmin && !isCurador && (
                  <button
                      className={`icon-btn ${isLoggedIn ? 'icon-btn--logged' : ''}`}
                      onClick={handleProfileClick}
                  >
                    <IconUser size={20} />
                    {isLoggedIn && <span className="icon-btn__dot" />}
                  </button>
              )}

              <button
                  className={`icon-btn ${menuOpen ? 'icon-btn--active' : ''}`}
                  onClick={() => setMenuOpen((v) => !v)}
              >
                {menuOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
              </button>
            </div>
          </nav>
          <div className="red-line" />
        </header>

        <div className="header-spacer" />

        {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}

        <div className={`menu-drawer ${menuOpen ? 'menu-drawer--open' : ''}`}>
          <p className="menu-drawer__title">Menu</p>
          <ul className="menu-drawer__list">

            {isAdmin && (
                <li className="mobile-admin-item">
                  <button
                      className="menu-drawer__item"
                      onClick={() => { navigate('/admin'); setMenuOpen(false); }}
                      style={{ color: '#f0a500' }}
                  >
                    <span className="menu-drawer__item-icon" style={{ color: '#f0a500' }}><IconDashboard size={20} /></span>
                    <span>Painel de Administração</span>
                  </button>
                </li>
            )}

            {isCurador && (
                <li className="mobile-admin-item">
                  <button
                      className="menu-drawer__item"
                      onClick={() => { navigate('/curador'); setMenuOpen(false); }}
                      style={{ color: '#f0a500' }}
                  >
                    <span className="menu-drawer__item-icon" style={{ color: '#f0a500' }}><IconDashboard size={20} /></span>
                    <span>Painel do Curador</span>
                  </button>
                </li>
            )}

            <div style={{ margin: '10px 28px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}></div>

            {sections.map((s) => (
                <li key={s.key}>
                  <button
                      className={`menu-drawer__item ${activeSection === s.key ? 'menu-drawer__item--active' : ''}`}
                      onClick={() => handleSection(s.key)}
                  >
                    <span className="menu-drawer__item-icon">{s.icon}</span>
                    <span>{s.label}</span>
                  </button>
                </li>
            ))}

            {/* SEÇÃO DO BOTÃO DE SAIR */}
            {isLoggedIn && (
              <>
                <div style={{ margin: '10px 28px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}></div>
                <li>
                  <button className="menu-drawer__item menu-drawer__logout-btn" onClick={handleLogout}>
                    <span className="menu-drawer__item-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                    </span>
                    <span>Sair</span>
                  </button>
                </li>
              </>
            )}

          </ul>
        </div>
      </>
  );
}