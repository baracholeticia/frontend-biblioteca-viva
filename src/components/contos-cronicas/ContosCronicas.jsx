import { useState } from 'react';
import './ContosCronicas.css';

const contos = [
    {
        id: 1,
        title: 'O Último Trem do Sertão',
        author: 'Beatriz Silva',
        tag: 'Suspense',
        starred: false,
    },
    {
        id: 2,
        title: 'Cartas que Nunca Enviei',
        author: 'Rafael Costa',
        tag: 'Romance',
        starred: true,
    },
    {
        id: 3,
        title: 'A Noite em que o Rio Secou',
        author: 'Camila Santos',
        tag: 'Drama',
        starred: false,
    },
];

const cronicas = [
    {
        id: 1,
        title: 'Feira de Caruaru numa Manhã de Sábado',
        author: 'Lucas Oliveira',
        date: '25 Nov 2025',
    },
    {
        id: 2,
        title: 'O Cheiro de Chuva no Agreste',
        author: 'Isabela Ferreira',
        date: '23 Nov 2025',
    },
    {
        id: 3,
        title: 'Minha Avó e o Rádio de Pilha',
        author: 'Gabriel Lima',
        date: '20 Nov 2025',
    },
];

function ContoCard({ title, author, tag, starred: initialStarred }) {
    const [starred, setStarred] = useState(initialStarred);

    return (
        <div className="cc-conto-card">
            <div className="cc-conto-card__top">
                <p className="cc-conto-card__title">{title}</p>
                <button
                    className="cc-conto-card__star"
                    onClick={() => setStarred((s) => !s)}
                    aria-label="Favoritar"
                >
                    {starred ? '⭐' : '☆'}
                </button>
            </div>
            <p className="cc-conto-card__author">por {author}</p>
            <span className="cc-conto-card__tag">{tag}</span>
        </div>
    );
}

function CronicaCard({ title, author, date }) {
    return (
        <div className="cc-cronica-card">
            <div className="cc-cronica-card__icon-box">
                📖
            </div>
            <div className="cc-cronica-card__info">
                <p className="cc-cronica-card__title">{title}</p>
                <p className="cc-cronica-card__author">{author}</p>
            </div>
            <span className="cc-cronica-card__date">{date}</span>
        </div>
    );
}

export function ContosCronicas() {
    return (
        <section className="cc-section">
            <div className="cc-container">
                <div className="cc-grid">

                    {/* CONTOS */}
                    <div>
                        <div className="cc-category__header">
                            <div className="cc-category__label">
                                <span className="cc-category__icon">📘</span>
                                <h2 className="cc-category__name">Contos</h2>
                            </div>
                            <a href="/contos" className="cc-category__link">Ver todos →</a>
                        </div>
                        {contos.map((c) => (
                            <ContoCard key={c.id} {...c} />
                        ))}
                    </div>

                    {/* CRÔNICAS */}
                    <div>
                        <div className="cc-category__header">
                            <div className="cc-category__label">
                                <span className="cc-category__icon">✍️</span>
                                <h2 className="cc-category__name">Crônicas</h2>
                            </div>
                            <a href="/cronicas" className="cc-category__link">Ver todos →</a>
                        </div>
                        {cronicas.map((c) => (
                            <CronicaCard key={c.id} {...c} />
                        ))}
                    </div>

                </div>
            </div>
        </section>
    );
}