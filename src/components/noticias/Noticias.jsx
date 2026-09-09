import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllWorks } from '../../services/workService';
import { IconCalendar, IconUser } from '../icons';
import './Noticias.css';

export function Noticias() {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    async function fetchNews() {
      try {
        const data = await getAllWorks('News');
        setNewsList(data.slice(0, 4)); // Pega as 4 mais recentes
      } catch (error) {
        console.error("Erro ao buscar notícias:", error);
      }
    }
    fetchNews();
  }, []);

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('pt-BR') : '';

  if (newsList.length === 0) return null;

  const destaque = newsList[0];
  const secundarias = newsList.slice(1, 4);

  return (
    <section className="news-section">
      <div className="news-container">
        <div className="news-header">
          <div>
            <h2 className="news-title">Avisos e Notícias</h2>
            <p className="news-subtitle">Fique por dentro das novidades da biblioteca e da escola</p>
          </div>
          <Link to="/categoria/noticias" className="news-ver-todas">Ver todas as notícias →</Link>
        </div>

        <div className="news-layout">
          {/* Notícia Principal */}
          {destaque && (
            <Link to={`/noticias/${destaque.id}`} className={`news-featured ${!destaque.url ? 'news-featured--text-only' : ''}`}>
              
              {/* Só exibe a div de imagem se tiver uma URL válida */}
              {destaque.url && (
                <div className="news-featured__img-wrap">
                  <img src={destaque.url} alt={destaque.title} className="news-featured__img" />
                  <div className="news-badge">Recente</div>
                </div>
              )}
              
              <div className="news-featured__content">
                {/* Se NÃO tiver imagem, o selo "Recente" aparece aqui dentro do texto */}
                {!destaque.url && (
                  <div className="news-badge-wrapper">
                     <span className="news-badge static-badge">Recente</span>
                  </div>
                )}
                
                <h3 className="news-featured__title">{destaque.title}</h3>
                <p className="news-featured__excerpt">{destaque.content || destaque.description}</p>
                <div className="news-meta">
                  <span className="news-meta-item"><IconUser size={14} /> {destaque.author}</span>
                  <span className="news-meta-item"><IconCalendar size={14} /> {formatDate(destaque.publicationDate)}</span>
                </div>
              </div>
            </Link>
          )}

          {/* Lista Lateral */}
          {secundarias.length > 0 && (
            <div className="news-sidebar">
              {secundarias.map((news) => (
                <Link to={`/noticias/${news.id}`} key={news.id} className="news-side-card">
                  {news.url && (
                    <img src={news.url} alt={news.title} className="news-side-card__img" />
                  )}
                  <div className="news-side-card__content">
                    <h4 className="news-side-card__title">{news.title}</h4>
                    <span className="news-side-card__date">{formatDate(news.publicationDate)}</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}