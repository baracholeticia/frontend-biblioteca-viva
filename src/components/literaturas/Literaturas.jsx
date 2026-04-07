import { useState } from 'react';
import { Link } from 'react-router-dom';
import { posts } from '../../data/posts';
import { IconBook, IconHeart } from '../icons';
import './Literaturas.css';

function BookCard({ id, categoryId, title, author, initialLikes, image }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(initialLikes);

  function handleLike(e) {
    e.preventDefault(); 
    if (liked) {
      setCount((c) => c - 1);
    } else {
      setCount((c) => c + 1);
    }
    setLiked(!liked);
  }

  return (
    <Link to={`/${categoryId}/${id}`} className="lit-card" style={{ textDecoration: 'none' }}>
      <img src={image} alt={title} className="lit-card__image" />

      <button
        className={`lit-card__like${liked ? ' lit-card__like--active' : ''}`}
        onClick={handleLike}
        aria-label="Curtir"
      >
        <IconHeart size={15} color={liked ? '#d93025' : 'currentColor'} />
        <span>{count}</span>
      </button>

      <div className="lit-card__overlay">
        <p className="lit-card__title">{title}</p>
        <p className="lit-card__author">por {author}</p>
      </div>
    </Link>
  );
}

export function Literaturas() {
  const cordeisList = posts.filter(p => p.categoryId === 'cordeis' && p.image).slice(0, 3);

  return (
    <section className="lit-section">
      <div className="lit-container">
        <div className="lit-hero">
          <h1 className="lit-hero__title">Literatura Pernambucana</h1>
          <p className="lit-hero__subtitle">
            Cordéis, contos e crônicas criados pelos estudantes de Pernambuco
          </p>
        </div>

        <div className="lit-category">
          <div className="lit-category__header">
            <div className="lit-category__label">
              <div className="lit-category__icon">
                <IconBook size={22} color="#d93025" />
              </div>
              <h2 className="lit-category__name">Cordéis</h2>
            </div>
            <Link to="/categoria/cordeis" className="lit-category__link">
              Ver todos →
            </Link>
          </div>

          <div className="lit-grid">
            {cordeisList.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}