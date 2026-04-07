import { useState } from 'react';
import { Link } from 'react-router-dom';
import { posts, livroDoMesConfig } from '../../data/posts';
import { IconBookmark, IconCalendar, IconMapPin, IconStar, IconCheck, IconUser } from '../icons';
import './ClubeLeitura.css';

function Stars({ count }) {
  return (
    <div className="cl-review-card__stars">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= count ? 'cl-star cl-star--filled' : 'cl-star'}>
          <IconStar size={14} filled={i <= count} color={i <= count ? '#f5a623' : '#ddd'} />
        </span>
      ))}
    </div>
  );
}

function ReviewCard({ id, categoryId, author, stars, excerpt }) {
  return (
    <Link to={`/${categoryId}/${id}`} className="cl-review-card" style={{ textDecoration: 'none' }}>
      <div className="cl-review-card__top">
        <div>
          <p className="cl-review-card__name">{author}</p>
          <p className="cl-review-card__turma">Resenha</p>
        </div>
        <Stars count={stars} />
      </div>
      <p className="cl-review-card__text">{excerpt}</p>
    </Link>
  );
}

export function ClubeLeitura() {
  const [confirmado, setConfirmado] = useState(false);
  const resenhasList = posts.filter(p => p.categoryId === 'clube-leitura').slice(0, 3);

  return (
    <section className="cl-section">
      <div className="cl-container">

        <div className="cl-hero">
          <h1 className="cl-hero__title">
            <span className="cl-hero__title-icon"><IconBookmark size={28} color="#d93025" /></span>
            Clube de Leitura
          </h1>
          <p className="cl-hero__subtitle">Leia, discuta e compartilhe suas impressões sobre o livro do mês</p>
        </div>

        <div className="cl-main-grid">
          <div className="cl-book-card">
            <div className="cl-book-card__header">
              <span className="cl-book-card__header-icon"><IconBookmark size={22} color="#ffffff" /></span>
              <h2 className="cl-book-card__header-title">Livro do Mês</h2>
            </div>
            <div className="cl-book-card__content">
              <img src={livroDoMesConfig.image} alt={livroDoMesConfig.title} className="cl-book-card__image" />
              <div className="cl-book-card__info">
                <p className="cl-book-card__title">{livroDoMesConfig.title}</p>
                <p className="cl-book-card__author">por {livroDoMesConfig.author}</p>
                <p className="cl-book-card__desc">{livroDoMesConfig.description}</p>
                <div className="cl-book-card__participants">
                  <IconUser size={16} color="rgba(255,255,255,0.8)" />
                  <span>{livroDoMesConfig.participants} participantes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="cl-meeting-card">
            <div className="cl-meeting-card__header">
              <span className="cl-meeting-card__header-icon"><IconCalendar size={22} color="#1a2f5e" /></span>
              <h2 className="cl-meeting-card__header-title">Próximo Encontro</h2>
            </div>

            <div className="cl-meeting-card__info-list">
              <div className="cl-meeting-card__info-item">
                <span className="cl-meeting-card__info-icon"><IconCalendar size={20} color="#d93025" /></span>
                <div>
                  <p className="cl-meeting-card__info-label">Data e Horário</p>
                  <p className="cl-meeting-card__info-value">{livroDoMesConfig.date}</p>
                </div>
              </div>
              <div className="cl-meeting-card__info-item">
                <span className="cl-meeting-card__info-icon"><IconMapPin size={20} color="#d93025" /></span>
                <div>
                  <p className="cl-meeting-card__info-label">Local</p>
                  <p className="cl-meeting-card__info-value">{livroDoMesConfig.local}</p>
                </div>
              </div>
            </div>

            <button className="cl-meeting-card__btn" onClick={() => setConfirmado((v) => !v)}>
              {confirmado ? (
                <><IconCheck size={16} /> Presença Confirmada!</>
              ) : 'Confirmar Presença'}
            </button>
            <p className="cl-meeting-card__hint">Traga sua resenha ou prepare sua opinião sobre o livro!</p>
          </div>
        </div>

        <div className="cl-reviews__header">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span className="cl-reviews__icon"><IconBookmark size={22} color="#1a2f5e" /></span>
            <h2 className="cl-reviews__title">Resenhas dos Alunos</h2>
          </div>
          <Link to="/categoria/clube-leitura" style={{ color: '#d93025', fontWeight: 600, textDecoration: 'none' }}>
            Ver Clube →
          </Link>
        </div>

        <div className="cl-reviews-grid">
          {resenhasList.map((r) => (
            <ReviewCard key={r.id} {...r} />
          ))}
        </div>
      </div>
    </section>
  );
}