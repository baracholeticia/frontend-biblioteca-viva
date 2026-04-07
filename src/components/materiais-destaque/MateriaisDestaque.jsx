import { Link } from 'react-router-dom';
import { posts } from '../../data/posts';
import { IconEye, IconHeart, IconDownload } from '../icons';
import './MateriaisDestaque.css';

export function MateriaisDestaque() {
  // Pega apenas os posts que têm a propriedade "featured" como true
  const materiais = posts.filter(p => p.featured).slice(0, 4);

  return (
    <section className="md-section">
      <div className="md-container">
        
        <div className="md-header">
          <div className="md-header__left">
            <h1 className="md-header__title">Materiais em Destaque</h1>
            <p className="md-header__subtitle">Contribuições recentes dos nossos alunos</p>
          </div>
        </div>

        <div className="md-grid">
          {materiais.map((item) => (
            <Link to={`/${item.categoryId}/${item.id}`} className="md-card" key={item.id} style={{ textDecoration: 'none' }}>
              <div className="md-card__img-wrap">
                <img src={item.image} alt={item.title} className="md-card__img" />
                <span className="md-card__badge">{item.category}</span>
              </div>
              
              <div className="md-card__body">
                <h2 className="md-card__title">{item.title}</h2>
                <p className="md-card__author">por {item.author}</p>
                <p className="md-card__shared">{item.excerpt}</p>
              </div>

              <div className="md-card__footer">
                <div className="md-card__stats">
                  <span className="md-card__stat"><IconEye size={16} /> {item.views}</span>
                  <span className="md-card__stat"><IconHeart size={16} /> {item.initialLikes}</span>
                </div>
                <button className="md-card__download" aria-label="Download" onClick={(e) => e.preventDefault()}>
                  <IconDownload size={18} />
                </button>
              </div>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}