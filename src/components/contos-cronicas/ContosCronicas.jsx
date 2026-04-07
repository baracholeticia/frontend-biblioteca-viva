import { useState } from 'react';
import { Link } from 'react-router-dom';
import { posts } from '../../data/posts';
import { IconDoc, IconFeather, IconStar } from '../icons';
import './ContosCronicas.css';

function ContoCard({ id, categoryId, title, author }) {
  const [starred, setStarred] = useState(false);

  const handleStar = (e) => {
    e.preventDefault();
    setStarred(s => !s);
  };

  return (
    <Link to={`/${categoryId}/${id}`} className="cc-conto-card" style={{ textDecoration: 'none' }}>
      <div className="cc-conto-card__top">
        <p className="cc-conto-card__title">{title}</p>
        <button className="cc-conto-card__star" onClick={handleStar} aria-label="Favoritar">
          <IconStar size={15} filled={starred} color={starred ? '#b8860b' : 'currentColor'} />
          {starred ? 'Favoritado' : 'Favoritar'}
        </button>
      </div>
      <p className="cc-conto-card__author">por {author}</p>
      {/* Usando o excerpt abreviado para substituir a 'tag' estática */}
      <span className="cc-conto-card__tag">Ficção</span>
    </Link>
  );
}

function CronicaCard({ id, categoryId, title, author, date }) {
  return (
    <Link to={`/${categoryId}/${id}`} className="cc-cronica-card" style={{ textDecoration: 'none' }}>
      <div className="cc-cronica-card__icon-box">
        <IconFeather size={24} color="#ffffff" />
      </div>
      <div className="cc-cronica-card__info">
        <p className="cc-cronica-card__title">{title}</p>
        <p className="cc-cronica-card__author">{author}</p>
      </div>
      <span className="cc-cronica-card__date">{date}</span>
    </Link>
  );
}

export function ContosCronicas() {
  const contosList = posts.filter(p => p.categoryId === 'contos').slice(0, 3);
  const cronicasList = posts.filter(p => p.categoryId === 'cronicas').slice(0, 3);

  return (
    <section className="cc-section">
      <div className="cc-container">
        <div className="cc-grid">
          
          <div>
            <div className="cc-category__header">
              <div className="cc-category__label">
                <div className="cc-category__icon">
                  <IconDoc size={22} color="#d93025" />
                </div>
                <h2 className="cc-category__name">Contos</h2>
              </div>
              <Link to="/categoria/contos" className="cc-category__link">Ver todos →</Link>
            </div>
            {contosList.map((c) => (
              <ContoCard key={c.id} {...c} />
            ))}
          </div>

          <div>
            <div className="cc-category__header">
              <div className="cc-category__label">
                <div className="cc-category__icon">
                  <IconFeather size={22} color="#d93025" />
                </div>
                <h2 className="cc-category__name">Crônicas</h2>
              </div>
              <Link to="/categoria/cronicas" className="cc-category__link">Ver todos →</Link>
            </div>
            {cronicasList.map((c) => (
              <CronicaCard key={c.id} {...c} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}