import './MateriaisDestaque.css';

const materiais = [
    {
        id: 1,
        title: 'A Memória das Pedras',
        author: 'Maria Silva',
        sharedBy: 'João Pedro',
        ano: '3º Ano',
        categoria: 'História Local',
        views: 234,
        likes: 45,
        image: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=400&fit=crop',
    },
    {
        id: 2,
        title: 'Festas e Folguedos do Nordeste',
        author: 'Pedro Santos',
        sharedBy: 'Ana Clara',
        ano: '2º Ano',
        categoria: 'Folclore',
        views: 189,
        likes: 38,
        image: 'https://images.unsplash.com/photo-1555685812-4b943f1cb0eb?w=600&h=400&fit=crop',
    },
    {
        id: 3,
        title: 'Entre Versos e Veredas',
        author: 'Ana Costa',
        sharedBy: 'Lucas Mendes',
        ano: '4º Ano',
        categoria: 'Literatura',
        views: 312,
        likes: 67,
        image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&h=400&fit=crop',
    },
    {
        id: 4,
        title: 'Arte em Olinda',
        author: 'Carlos Eduardo',
        sharedBy: 'Beatriz Lima',
        ano: '1º Ano',
        categoria: 'Artes Visuais',
        views: 276,
        likes: 52,
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop',
    },
];

function EyeIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
            <circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function HeartIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
        </svg>
    );
}

function DownloadIcon() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
             stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    );
}

export function MateriaisDestaque() {
    return (
        <section className="md-section">
            <div className="md-container">

                {/* HEADER */}
                <div className="md-header">
                    <div className="md-header__left">
                        <h1 className="md-header__title">Materiais em Destaque</h1>
                        <p className="md-header__subtitle">Contribuições recentes dos nossos alunos</p>
                    </div>
                    <a href="#" className="md-header__link">Ver todos →</a>
                </div>

                {/* GRID */}
                <div className="md-grid">
                    {materiais.map((item) => (
                        <div className="md-card" key={item.id}>
                            {/* IMAGE */}
                            <div className="md-card__img-wrap">
                                <img
                                    src={item.image}
                                    alt={item.title}
                                    className="md-card__img"
                                />
                                <span className="md-card__badge">{item.categoria}</span>
                            </div>

                            {/* BODY */}
                            <div className="md-card__body">
                                <h2 className="md-card__title">{item.title}</h2>
                                <p className="md-card__author">por {item.author}</p>
                                <p className="md-card__shared">
                                    Compartilhado por {item.sharedBy} - {item.ano}
                                </p>
                            </div>

                            {/* FOOTER */}
                            <div className="md-card__footer">
                                <div className="md-card__stats">
                                    <span className="md-card__stat">
                                        <EyeIcon /> {item.views}
                                    </span>
                                    <span className="md-card__stat">
                                        <HeartIcon /> {item.likes}
                                    </span>
                                </div>
                                <button className="md-card__download" aria-label="Download">
                                    <DownloadIcon />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}