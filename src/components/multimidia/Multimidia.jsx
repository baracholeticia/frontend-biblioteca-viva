import { Link } from 'react-router-dom';
import { posts } from '../../data/posts';
import { IconBarChart, IconPalette, IconVideo, IconHand } from '../icons';
import './Multimidia.css';

export function Multimidia() {
  const infograficosList = posts.filter(p => p.categoryId === 'infograficos').slice(0, 3);
  const artesList = posts.filter(p => p.categoryId === 'artes').slice(0, 4);
  const videosList = posts.filter(p => p.categoryId === 'videos').slice(0, 3);
  const librasList = posts.filter(p => p.categoryId === 'libras').slice(0, 3);

  return (
    <section className="mv-section">
      <div className="mv-container">
        
        <div className="mv-hero">
          <h1 className="mv-hero__title">Multimídia e Criações Visuais</h1>
          <p className="mv-hero__subtitle">Infográficos, artes, vídeos e literatura em Libras</p>
        </div>

        {/* Infográficos */}
        <div className="mv-category__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="mv-category__icon"><IconBarChart size={22} color="#d93025" /></span>
            <h2 className="mv-category__name">Infográficos em Foco</h2>
          </div>
          <Link to="/categoria/infograficos" style={{ color: '#d93025', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>Ver todos →</Link>
        </div>

        <div className="mv-grid mv-grid--3 mv-mb">
          {infograficosList.map((item) => (
            <Link to={`/${item.categoryId}/${item.id}`} className="mv-card" key={item.id} style={{ textDecoration: 'none' }}>
              <div className="mv-card__preview">
                <IconBarChart size={60} color="#ffffff" />
              </div>
              <div className="mv-card__info">
                <p className="mv-card__title">{item.title}</p>
                <p className="mv-card__author">Criado por {item.author}</p>
                <p className="mv-card__turma">{item.excerpt}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Galeria de Artes */}
        <div className="mv-category__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="mv-category__icon"><IconPalette size={22} color="#d93025" /></span>
            <h2 className="mv-category__name">Galeria de Artes</h2>
          </div>
          <Link to="/categoria/artes" style={{ color: '#d93025', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>Ver todas →</Link>
        </div>

        <div className="mv-grid mv-grid--4 mv-mb">
          {artesList.map((item) => (
            <Link to={`/${item.categoryId}/${item.id}`} className="mv-arte-card" key={item.id} style={{ textDecoration: 'none' }}>
              <img src={item.image} alt={item.title} className="mv-arte-card__image" />
              <p className="mv-arte-card__title">{item.title}</p>
              <p className="mv-arte-card__author">{item.author}</p>
            </Link>
          ))}
        </div>

        <div className="mv-grid mv-grid--2">
          {/* Vídeos Autorais */}
          <div>
            <div className="mv-category__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="mv-category__icon"><IconVideo size={22} color="#d93025" /></span>
                <h2 className="mv-category__name">Curtas e Vídeos Autorais</h2>
              </div>
              <Link to="/categoria/videos" style={{ color: '#d93025', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>Ver todos →</Link>
            </div>
            <div className="mv-list">
              {videosList.map((item) => (
                <Link to={`/${item.categoryId}/${item.id}`} className="mv-list-item" key={item.id} style={{ textDecoration: 'none' }}>
                  <div className="mv-list-item__icon mv-list-item__icon--red"><IconVideo size={24} color="#fff" /></div>
                  <div className="mv-list-item__info">
                    <p className="mv-list-item__title">{item.title}</p>
                    <p className="mv-list-item__sub">{item.author}</p>
                    <span className="mv-list-item__badge">{item.duration}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Literatura em Libras */}
          <div>
            <div className="mv-category__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="mv-category__icon"><IconHand size={22} color="#d93025" /></span>
                <h2 className="mv-category__name">Literatura em Libras</h2>
              </div>
              <Link to="/categoria/libras" style={{ color: '#d93025', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>Ver todas →</Link>
            </div>
            <div className="mv-list">
              {librasList.map((item) => (
                <Link to={`/${item.categoryId}/${item.id}`} className="mv-list-item" key={item.id} style={{ textDecoration: 'none' }}>
                  <div className="mv-list-item__icon mv-list-item__icon--navy"><IconHand size={24} color="#fff" /></div>
                  <div className="mv-list-item__info">
                    <p className="mv-list-item__title">{item.title}</p>
                    <p className="mv-list-item__sub">Interpretado por {item.author}</p>
                    <span className="mv-list-item__badge">{item.duration}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}