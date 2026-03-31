import { useState } from 'react';
import './ClubeLeitura.css';

const livroDoMes = {
    title: 'Quarto de Despejo',
    author: 'Carolina Maria de Jesus',
    description:
        'Diário de uma mulher que viveu na favela do Canindé, em São Paulo, nos anos 1950. Uma obra fundamental da literatura brasileira.',
    participants: 34,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
};

const proximoEncontro = {
    date: '15 de Dezembro, 14h',
    local: 'Biblioteca da Escola',
};

const resenhas = [
    {
        id: 1,
        name: 'Maria Eduarda',
        turma: '3º Ano A',
        stars: 5,
        text: 'Uma obra que me fez refletir profundamente sobre desigualdade social. Carolina escreve com uma força e honestidade raras. Leitura obrigatória.',
        video: null,
    },
    {
        id: 2,
        name: 'João Pedro',
        turma: '2º Ano B',
        stars: 5,
        text: null,
        video: 'https://youtube.com',
    },
    {
        id: 3,
        name: 'Ana Clara',
        turma: '1º Ano C',
        stars: 4,
        text: 'O diário de Carolina é devastador e bonito ao mesmo tempo. Cada página é um retrato vivo do Brasil que muitos preferem ignorar.',
        video: null,
    },
];

function Stars({ count }) {
    return (
        <div className="cl-review-card__stars">
            {[1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={i <= count ? 'cl-star cl-star--filled' : 'cl-star'}>
                    ★
                </span>
            ))}
        </div>
    );
}

function ReviewCard({ name, turma, stars, text, video }) {
    return (
        <div className="cl-review-card">
            <div className="cl-review-card__top">
                <div>
                    <p className="cl-review-card__name">{name}</p>
                    <p className="cl-review-card__turma">{turma}</p>
                </div>
                <Stars count={stars} />
            </div>
            {text && <p className="cl-review-card__text">{text}</p>}
            {video && (
                <div className="cl-review-card__video-area">
                    <p className="cl-review-card__video-label">Assistir ao vídeo-resenha</p>
                    <a href={video} className="cl-review-card__video-link" target="_blank" rel="noreferrer">
                        💬 Ver vídeo-resenha
                    </a>
                </div>
            )}
        </div>
    );
}

export function ClubeLeitura() {
    const [confirmado, setConfirmado] = useState(false);

    return (
        <section className="cl-section">
            <div className="cl-container">

                {/* HERO */}
                <div className="cl-hero">
                    <h1 className="cl-hero__title">
                        <span className="cl-hero__title-icon">📖</span>
                        Clube de Leitura
                    </h1>
                    <p className="cl-hero__subtitle">
                        Leia, discuta e compartilhe suas impressões sobre o livro do mês
                    </p>
                </div>

                {/* MAIN GRID */}
                <div className="cl-main-grid">

                    {/* LIVRO DO MÊS */}
                    <div className="cl-book-card">
                        <div className="cl-book-card__header">
                            <span className="cl-book-card__header-icon">📚</span>
                            <h2 className="cl-book-card__header-title">Livro do Mês</h2>
                        </div>
                        <div className="cl-book-card__content">
                            <img
                                src={livroDoMes.image}
                                alt={livroDoMes.title}
                                className="cl-book-card__image"
                            />
                            <div className="cl-book-card__info">
                                <p className="cl-book-card__title">{livroDoMes.title}</p>
                                <p className="cl-book-card__author">por {livroDoMes.author}</p>
                                <p className="cl-book-card__desc">{livroDoMes.description}</p>
                                <div className="cl-book-card__participants">
                                    <span>👥</span>
                                    <span>{livroDoMes.participants} participantes</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* PRÓXIMO ENCONTRO */}
                    <div className="cl-meeting-card">
                        <div className="cl-meeting-card__header">
                            <span className="cl-meeting-card__header-icon">📅</span>
                            <h2 className="cl-meeting-card__header-title">Próximo Encontro</h2>
                        </div>

                        <div className="cl-meeting-card__info-list">
                            <div className="cl-meeting-card__info-item">
                                <span className="cl-meeting-card__info-icon">📅</span>
                                <div>
                                    <p className="cl-meeting-card__info-label">Data e Horário</p>
                                    <p className="cl-meeting-card__info-value">{proximoEncontro.date}</p>
                                </div>
                            </div>
                            <div className="cl-meeting-card__info-item">
                                <span className="cl-meeting-card__info-icon">📍</span>
                                <div>
                                    <p className="cl-meeting-card__info-label">Local</p>
                                    <p className="cl-meeting-card__info-value">{proximoEncontro.local}</p>
                                </div>
                            </div>
                        </div>

                        <button
                            className="cl-meeting-card__btn"
                            onClick={() => setConfirmado((v) => !v)}
                        >
                            {confirmado ? '✓ Presença Confirmada!' : 'Confirmar Presença'}
                        </button>
                        <p className="cl-meeting-card__hint">
                            Traga sua resenha ou prepare sua opinião sobre o livro!
                        </p>
                    </div>

                </div>

                {/* RESENHAS DOS ALUNOS */}
                <div className="cl-reviews__header">
                    <span className="cl-reviews__icon">💬</span>
                    <h2 className="cl-reviews__title">Resenhas dos Alunos</h2>
                </div>

                <div className="cl-reviews-grid">
                    {resenhas.map((r) => (
                        <ReviewCard key={r.id} {...r} />
                    ))}
                </div>

            </div>
        </section>
    );
}