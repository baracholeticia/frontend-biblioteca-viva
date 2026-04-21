import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllWorks } from '../../services/workService';
import { IconDoc, IconFeather } from '../icons';
import './ContosCronicas.css';

function ContoCard({ id, title, author }) {
  return (
      <Link to={`/contos/${id}`} className="cc-conto-card" style={{ textDecoration: 'none' }}>
        <div className="cc-conto-card__top">
          <p className="cc-conto-card__title">{title}</p>
        </div>
        <p className="cc-conto-card__author">por {author}</p>
        <span className="cc-conto-card__tag">Conto</span>
      </Link>
  );
}

function CronicaCard({ id, title, author, publicationDate }) {
  const date = publicationDate ? new Date(publicationDate).toLocaleDateString('pt-BR') : '';
  return (
      <Link to={`/cronicas/${id}`} className="cc-cronica-card" style={{ textDecoration: 'none' }}>
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
  const [contos, setContos] = useState([]);
  const [cronicas, setCronicas] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [contosData, cronicasData] = await Promise.all([
          getAllWorks('Tale'),
          getAllWorks('ShortStory')
        ]);
        setContos(contosData.slice(0, 3));
        setCronicas(cronicasData.slice(0, 3));
      } catch (error) {
        console.error("Erro ao buscar Contos e Crônicas:", error);
      }
    }
    fetchData();
  }, []);

  if (contos.length === 0 && cronicas.length === 0) return null;

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
              {contos.map((c) => (
                  <ContoCard key={c.id} {...c} />
              ))}
              {contos.length === 0 && <p style={{ color: '#666' }}>Nenhum conto publicado.</p>}
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
              {cronicas.map((c) => (
                  <CronicaCard key={c.id} {...c} />
              ))}
              {cronicas.length === 0 && <p style={{ color: '#666' }}>Nenhuma crônica publicada.</p>}
            </div>

          </div>
        </div>
      </section>
  );
}