import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllWorks } from '../../services/workService';
import { IconNewspaper, IconUser, IconCalendar } from '../icons';
import './JornalEscola.css';

export function JornalEscola() {
  const [jornalPosts, setJornalPosts] = useState([]);

  useEffect(() => {
    async function fetchJornal() {
      try {
        const data = await getAllWorks('Article');
        setJornalPosts(data);
      } catch (error) {
        console.error("Erro ao buscar Jornal:", error);
      }
    }
    fetchJornal();
  }, []);

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('pt-BR') : '';

  if (jornalPosts.length === 0) return null;

  const destaqueMateria = jornalPosts[0];
  const materias = jornalPosts.slice(1, 4);

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

        {destaqueMateria && (
          <div className="je-featured">
            {destaqueMateria.url && <img src={destaqueMateria.url} alt={destaqueMateria.title} className="je-featured__image" />}
            <div className="je-featured__content">
              <span className="je-featured__badge">Destaque</span>
              <h2 className="je-featured__title">{destaqueMateria.title}</h2>
              <p className="je-featured__desc">{destaqueMateria.description}</p>
              <div className="je-featured__meta">
                <span className="je-featured__meta-item"><IconUser size={14} /> {destaqueMateria.author}</span>
                <span className="je-featured__meta-item"><IconCalendar size={14} /> {formatDate(destaqueMateria.publicationDate)}</span>
              </div>
              <Link to={`/jornal/${destaqueMateria.id}`} className="je-featured__link">
                Ler matéria completa →
              </Link>
            </div>
          </div>
        )}

        <div className="je-grid">
          {materias.map((m) => (
            <Link to={`/jornal/${m.id}`} className="je-card" key={m.id} style={{ textDecoration: 'none' }}>
              <div className="je-card__content">
                <span className="je-card__badge">Artigo</span>
                <p className="je-card__title">{m.title}</p>
                <p className="je-card__desc">{m.description}</p>
                <div className="je-card__meta">
                  <span className="je-card__meta-item"><IconUser size={13} /> {m.author}</span>
                  <span className="je-card__meta-item"><IconCalendar size={13} /> {formatDate(m.publicationDate)}</span>
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