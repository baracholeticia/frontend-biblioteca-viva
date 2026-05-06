import { useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  IconBook, IconUser, IconMenu, IconClose,
  IconAward, IconScrollText, IconDoc, IconFeather,
  IconBookmark, IconNewspaper, IconBarChart, IconPalette,
  IconVideo, IconGlobe, IconPencil,
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

  const isAdmin = useMemo(() => {
    if (!token) return false;
    
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const role = payload.role || payload.roles || '';
      return role.includes('ADMIN') || role === 'ROLE_ADMIN';
    } catch (e) {
      console.error("Erro ao verificar permissões:", e);
      return false;
    }
  }, [token]);

  const activeSection = location.pathname.startsWith('/categoria/')
      ? location.pathname.split('/')[2]
      : null;

  const handleSection = (key) => {
    navigate(`/categoria/${key}`);
    setMenuOpen(false);
  };

  const handleLogoClick = () => {
    navigate('/');
    setMenuOpen(false);
  };

  const handleUserClick = () => {
    if (isLoggedIn) {
      navigate('/perfil');
    } else {
      navigate('/login');
    }
  };

  return (
      <>
        <header>
          <nav className="topbar">
            <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
              <span className="logo__icon"><IconBook size={22} color="#f0a500" /></span>
              <div className="logo__text-group">
                <span className="logo__title">BIBLIOTECA VIVA</span>
                <span className="logo__subtitle">EREM Abílio Monteiro</span>
              </div>
            </div>
            
            <div className="icons" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {isAdmin && (
                  <button
                      onClick={() => navigate('/admin')}
                      style={{
                          background: '#d62828',
                          color: '#fff',
                          border: 'none',
                          padding: '6px 14px',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontWeight: 600,
                          fontSize: '13px',
                          fontFamily: 'Poppins, system-ui, sans-serif',
                          marginRight: '8px'
                      }}
                  >
                      Admin
                  </button>
              )}

              <button
                  className={`icon-btn ${isLoggedIn ? 'icon-btn--logged' : ''}`}
                  title={isLoggedIn ? 'Meu perfil' : 'Entrar'}
                  onClick={handleUserClick}
              >
                <IconUser size={20} />
                {isLoggedIn && <span className="icon-btn__dot" />}
              </button>
              
              <button
                  className={`icon-btn ${menuOpen ? 'icon-btn--active' : ''}`}
                  title="Menu"
                  onClick={() => setMenuOpen((v) => !v)}
                  aria-label="Abrir menu"
              >
                {menuOpen ? <IconClose size={22} /> : <IconMenu size={22} />}
              </button>
            </div>
          </nav>
          <div className="red-line" />
        </header>

        <div className="header-spacer" />

        {menuOpen && (
            <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
        )}

        <div className={`menu-drawer ${menuOpen ? 'menu-drawer--open' : ''}`}>
          <p className="menu-drawer__title">Seções da Biblioteca</p>
          <ul className="menu-drawer__list">
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
          </ul>
        </div>
      </>
  );
}