import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllWorks } from '../../services/workService';
import { IconEye, IconMessage, IconFolder } from '../icons';
import './OutrasProducoes.css';

export function OutrasProducoes() {
  const [producoes, setProducoes] = useState([]);

  useEffect(() => {
    async function fetchOthers() {
      try {
        const data = await getAllWorks('Other');
        setProducoes(data.slice(0, 4));
      } catch (error) {
        console.error("Erro ao buscar Outras Produções:", error);
      }
    }
    fetchOthers();
  }, []);

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('pt-BR') : '';

  if (producoes.length === 0) return null;

  return (
    <section className="op-section">
      <div className="op-container">
        <div className="op-header">
          <div>
            <h2 className="op-title">
              <span className="op-title__icon"><IconFolder size={22} color="#d93025" /></span>
              Outras Produções
            </h2>
            <p className="op-subtitle">Projetos, portfólios e criações diversas da comunidade</p>
          </div>
          <Link to="/categoria/outros" className="op-ver-todas">Ver todas →</Link>
        </div>

        <div className="op-grid">
          {producoes.map((item) => {
            const image = item.imageUrl || item.url;
            const hasImage = !!image && image.match(/\.(jpeg|jpg|gif|png)$/) != null;

            return (
              <Link to={`/outros/${item.id}`} key={item.id} className={`op-card ${!hasImage ? 'op-card--text-only' : ''}`}>
                {hasImage && (
                  <div className="op-card__img-wrap">
                    <img src={image} alt={item.title} className="op-card__img" />
                    <span className="op-card__badge">Produção</span>
                  </div>
                )}
                
                <div className="op-card__body">
                  {!hasImage && <span className="op-card__badge static-badge">Produção</span>}
                  <h3>{item.title}</h3>
                  <p className="op-card__desc">{item.description}</p>
                  <p className="op-card__date">{formatDate(item.publicationDate)}</p>
                </div>

                <div className="op-card__info">
                  <span className="op-card__author"><strong>Por:</strong> {item.author}</span>
                  <div className="op-card__stats">
                    <span><IconEye size={15} /> {item.viewCount || 0}</span>
                    <span><IconMessage size={15} /> {item.commentCount || 0}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}