import { Link } from 'react-router-dom';
// 1. Mudamos a importação para puxar APENAS o 'posts'
import { posts } from '../../data/posts';
import { IconNewspaper, IconUser, IconCalendar } from '../icons';
import './JornalEscola.css';

export function JornalEscola() {
  // 2. Agora nós filtramos o que é do jornal por aqui mesmo!
  const jornalPosts = posts.filter(p => p.categoryId === 'jornal');
  const destaqueMateria = jornalPosts[0]; // Pega o primeiro post do jornal
  const materias = jornalPosts.slice(1, 4); // Pega os próximos 3 posts

  return (
    <section className="je-section">
      <div className="je-container">

        <div className="je-hero">
          <h1 className="je-hero__title">
            <span className="je-hero__title-icon"><IconNewspaper size={28} color="#d93025" /></span>
            Jornal da Escola
          </h1>
          <p className="je-hero__subtitle">Reportagens, entrevistas e crônicas sobre o cotidiano escolar</p>
        </div>

        {/* MATÉRIA EM DESTAQUE */}
        {destaqueMateria && (
          <div className="je-featured">
            <img src={destaqueMateria.image} alt={destaqueMateria.title} className="je-featured__image" />
            <div className="je-featured__content">
              <span className="je-featured__badge">Destaque</span>
              <h2 className="je-featured__title">{destaqueMateria.title}</h2>
              <p className="je-featured__desc">{destaqueMateria.excerpt}</p>
              <div className="je-featured__meta">
                <span className="je-featured__meta-item"><IconUser size={14} /> {destaqueMateria.author}</span>
                <span className="je-featured__meta-item"><IconCalendar size={14} /> {destaqueMateria.date}</span>
              </div>
              <Link to={`/jornal/${destaqueMateria.id}`} className="je-featured__link">
                Ler matéria completa →
              </Link>
            </div>
          </div>
        )}

        {/* OUTRAS MATÉRIAS */}
        <div className="je-grid">
          {materias.map((m) => (
            <Link to={`/jornal/${m.id}`} className="je-card" key={m.id} style={{ textDecoration: 'none' }}>
              <div className="je-card__content">
                <span className="je-card__badge">{m.category}</span>
                <p className="je-card__title">{m.title}</p>
                <p className="je-card__desc">{m.excerpt}</p>
                <div className="je-card__meta">
                  <span className="je-card__meta-item"><IconUser size={13} /> {m.author}</span>
                  <span className="je-card__meta-item"><IconCalendar size={13} /> {m.date}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="je-footer">
          <Link to="/categoria/jornal" className="je-footer__btn">
            Ver todas as matérias
          </Link>
        </div>

      </div>
    </section>
  );
}