import { useState } from 'react';
import './Literaturas.css';

const cordeis = [
    {
        id: 1,
        title: 'Título',
        author: 'Pedro Silva',
        likes: 12,
        image: 'https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=600&h=450&fit=crop',
    },
    {
        id: 2,
        title: 'Título',
        author: 'Maria Clara',
        likes: 20,
        image: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=600&h=450&fit=crop',
    },
    {
        id: 3,
        title: 'Título',
        author: 'João Antonio',
        likes: 17,
        image: 'https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=600&h=450&fit=crop',
    },
];

function BookCard({ title, author, likes, image }) {
    const [liked, setLiked] = useState(false);
    const [count, setCount] = useState(likes);

    function handleLike() {
        if (liked) {
            setCount((c) => c - 1);
        } else {
            setCount((c) => c + 1);
        }
        setLiked(!liked);
    }

    return (
        <div className="lit-card">
            <img src={image} alt={title} className="lit-card__image" />

            <button
                className={`lit-card__like${liked ? ' lit-card__like--active' : ''}`}
                onClick={handleLike}
                aria-label="Curtir"
            >
                <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill={liked ? 'currentColor' : 'none'}
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <span>{count}</span>
            </button>

            <div className="lit-card__overlay">
                <p className="lit-card__title">{title}</p>
                <p className="lit-card__author">por {author}</p>
            </div>
        </div>
    );
}

export function Literaturas() {
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
                            <span className="lit-category__icon">📜</span>
                            <h2 className="lit-category__name">Cordéis</h2>
                        </div>
                        <a href="/cordeis" className="lit-category__link">
                            Ver todos →
                        </a>
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