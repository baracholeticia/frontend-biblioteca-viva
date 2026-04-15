import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllWorks } from '../../services/workService';
import { IconBook, IconHeart } from '../icons';
import './Literaturas.css';

function BookCard({ id, title, author, likeCount, url }) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState(likeCount || 0);

  function handleLike(e) {
    e.preventDefault(); 
    setCount((c) => liked ? c - 1 : c + 1);
    setLiked(!liked);
  }

  return (
    <Link to={`/cordeis/${id}`} className="lit-card" style={{ textDecoration: 'none' }}>
      <div className="lit-card__image" style={{backgroundColor: '#1a2f5e', display: 'flex', alignItems:'center', justifyContent:'center', height: '100%'}}>
        {url ? <img src={url} alt={title} style={{width: '100%', height:'100%', objectFit: 'cover'}}/> : <IconBook size={48} color="rgba(255,255,255,0.2)"/>}
      </div>

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
  const [cordeis, setCordeis] = useState([]);

  useEffect(() => {
    async function fetchCordeis() {
      try {
        const data = await getAllWorks('Cordel');
        setCordeis(data.slice(0, 3));
      } catch (error) {
        console.error("Erro ao buscar Cordéis:", error);
      }
    }
    fetchCordeis();
  }, []);

  if (cordeis.length === 0) return null;

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
            {cordeis.map((book) => (
              <BookCard key={book.id} {...book} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}