import './Multimidia.css';

const infograficos = [
    {
        id: 1,
        title: 'Desmatamento no Nordeste',
        author: 'Lucas Mendes',
        turma: '2º A',
    },
    {
        id: 2,
        title: 'Água e Saneamento no Sertão',
        author: 'Maria Clara',
        turma: '1º B',
    },
    {
        id: 3,
        title: 'Energia Solar em Pernambuco',
        author: 'João Vitor',
        turma: '3º C',
    },
];

const artes = [
    {
        id: 1,
        title: 'Cores do Sertão',
        author: 'Camila Santos',
        image: 'https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=400&h=400&fit=crop',
    },
    {
        id: 2,
        title: 'Jardim Nordestino',
        author: 'Rafael Costa',
        image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
    },
    {
        id: 3,
        title: 'Pinceladas do Agreste',
        author: 'Beatriz Lima',
        image: 'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=400&h=400&fit=crop',
    },
    {
        id: 4,
        title: 'Rosto da Cidade',
        author: 'Pedro Silva',
        image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=400&fit=crop',
    },
];

const videos = [
    { id: 1, title: 'Curta: A Seca e o Sonho', author: 'Ana Paula & equipe', duration: '8min' },
    { id: 2, title: 'Vídeo-Poema: Raízes do Sertão', author: 'Gabriel Lima', duration: '3min' },
    { id: 3, title: 'Entrevista: Vozes da Comunidade', author: 'Jornal da Escola', duration: '12min' },
];

const libras = [
    { id: 1, title: 'O Menino que Plantou Estrelas', interpreter: 'Júlia Santos', duration: '5min' },
    { id: 2, title: 'Contos do Agreste', interpreter: 'Lucas Oliveira', duration: '7min' },
    { id: 3, title: 'A Lenda do Rio Capibaribe', interpreter: 'Mariana Costa', duration: '4min' },
];

function BarChartIcon() {
    return (
        <svg
            className="mv-card__preview-icon"
            width="80"
            height="80"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <line x1="18" y1="20" x2="18" y2="10" />
            <line x1="12" y1="20" x2="12" y2="4" />
            <line x1="6" y1="20" x2="6" y2="14" />
            <line x1="2" y1="20" x2="22" y2="20" />
        </svg>
    );
}

function VideoIcon() {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
             stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="15" height="14" rx="2" ry="2" />
            <polygon points="17 8 22 12 17 16 17 8" />
        </svg>
    );
}

function HandIcon({ color = '#ffffff' }) {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none"
             stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0" />
            <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2" />
            <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8" />
            <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15" />
        </svg>
    );
}

export function Multimidia() {
    return (
        <section className="mv-section">
            <div className="mv-container">

                {/* HERO */}
                <div className="mv-hero">
                    <h1 className="mv-hero__title">Multimídia e Criações Visuais</h1>
                    <p className="mv-hero__subtitle">
                        Infográficos, artes, vídeos e literatura em Libras
                    </p>
                </div>

                {/* INFOGRÁFICOS EM FOCO */}
                <div className="mv-category__header">
                    <span className="mv-category__icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                             stroke="#d93025" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="20" x2="18" y2="10" />
                            <line x1="12" y1="20" x2="12" y2="4" />
                            <line x1="6" y1="20" x2="6" y2="14" />
                            <line x1="2" y1="20" x2="22" y2="20" />
                        </svg>
                    </span>
                    <h2 className="mv-category__name">Infográficos em Foco</h2>
                </div>

                <div className="mv-grid mv-grid--3 mv-mb">
                    {infograficos.map((item) => (
                        <div className="mv-card" key={item.id}>
                            <div className="mv-card__preview">
                                <BarChartIcon />
                            </div>
                            <div className="mv-card__info">
                                <p className="mv-card__title">{item.title}</p>
                                <p className="mv-card__author">Criado por {item.author}</p>
                                <p className="mv-card__turma">{item.turma}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* GALERIA DE ARTES */}
                <div className="mv-category__header">
                    <span className="mv-category__icon">
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                             stroke="#d93025" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                    </span>
                    <h2 className="mv-category__name">Galeria de Artes</h2>
                </div>

                <div className="mv-grid mv-grid--4 mv-mb">
                    {artes.map((item) => (
                        <div className="mv-arte-card" key={item.id}>
                            <img
                                src={item.image}
                                alt={item.title}
                                className="mv-arte-card__image"
                            />
                            <p className="mv-arte-card__title">{item.title}</p>
                            <p className="mv-arte-card__author">{item.author}</p>
                        </div>
                    ))}
                </div>

                {/* VÍDEOS + LIBRAS (2 colunas) */}
                <div className="mv-grid mv-grid--2">

                    {/* CURTAS E VÍDEOS AUTORAIS */}
                    <div>
                        <div className="mv-category__header">
                            <span className="mv-category__icon">
                                <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
                                     stroke="#d93025" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="2" y="3" width="15" height="14" rx="2" ry="2" />
                                    <polygon points="17 8 22 12 17 16 17 8" />
                                </svg>
                            </span>
                            <h2 className="mv-category__name">Curtas e Vídeos Autorais</h2>
                        </div>
                        <div className="mv-list">
                            {videos.map((item) => (
                                <div className="mv-list-item" key={item.id}>
                                    <div className="mv-list-item__icon mv-list-item__icon--red">
                                        <VideoIcon />
                                    </div>
                                    <div className="mv-list-item__info">
                                        <p className="mv-list-item__title">{item.title}</p>
                                        <p className="mv-list-item__sub">{item.author}</p>
                                        <span className="mv-list-item__badge">{item.duration}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* LITERATURA EM LIBRAS */}
                    <div>
                        <div className="mv-category__header">
                            <span className="mv-category__icon">
                                <HandIcon color="#d93025" />
                            </span>
                            <h2 className="mv-category__name">Literatura em Libras</h2>
                        </div>
                        <div className="mv-list">
                            {libras.map((item) => (
                                <div className="mv-list-item" key={item.id}>
                                    <div className="mv-list-item__icon mv-list-item__icon--navy">
                                        <HandIcon />
                                    </div>
                                    <div className="mv-list-item__info">
                                        <p className="mv-list-item__title">{item.title}</p>
                                        <p className="mv-list-item__sub">Interpretado por {item.interpreter}</p>
                                        <span className="mv-list-item__badge">{item.duration}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

            </div>
        </section>
    );
}