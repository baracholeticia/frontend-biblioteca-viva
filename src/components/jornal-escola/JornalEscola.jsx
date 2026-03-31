import './JornalEscola.css';

const destaqueMateria = {
    title: 'Grêmio Estudantil lança campanha de arrecadação para biblioteca escolar',
    desc: 'Estudantes do 3º ano organizaram uma campanha para ampliar o acervo da biblioteca com livros de literatura nordestina, ciências e tecnologia. A iniciativa já conta com mais de 200 doações.',
    author: 'Ana Beatriz Souza',
    date: '28 Nov 2025',
    image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&h=500&fit=crop',
    link: '/jornal/gremio-biblioteca',
};

const materias = [
    {
        id: 1,
        category: 'Ciência',
        title: 'Alunos do 2º ano desenvolvem filtro d\'água sustentável com materiais recicláveis',
        desc: 'O projeto, orientado pela professora de química, foi apresentado na Feira de Ciências regional e conquistou o primeiro lugar na categoria inovação ambiental.',
        author: 'Professor Docente',
        date: '25 Nov 2025',
    },
    {
        id: 2,
        category: 'Esporte',
        title: 'Time de futsal da escola se classifica para o estadual após virada emocionante',
        desc: 'Em jogo disputado no ginásio municipal, os alunos viraram o placar nos últimos minutos e garantiram vaga na fase estadual dos Jogos Estudantis de Pernambuco.',
        author: 'Pesquisador Jovem',
        date: '22 Nov 2025',
    },
    {
        id: 3,
        category: 'Cultura',
        title: 'Exposição de arte urbana transforma os muros da escola em galeria a céu aberto',
        desc: 'Com temas sobre identidade nordestina e meio ambiente, os painéis foram criados pelos estudantes do curso de artes visuais ao longo de dois meses de trabalho.',
        author: 'Artista Escolar',
        date: '20 Nov 2025',
    },
];

export function JornalEscola() {
    return (
        <section className="je-section">
            <div className="je-container">

                {/* HERO */}
                <div className="je-hero">
                    <h1 className="je-hero__title">
                        <span className="je-hero__title-icon">📰</span>
                        Jornal da Escola
                    </h1>
                    <p className="je-hero__subtitle">
                        Reportagens, entrevistas e crônicas sobre o cotidiano escolar
                    </p>
                </div>

                {/* MATÉRIA DESTAQUE */}
                <div className="je-featured">
                    <img
                        src={destaqueMateria.image}
                        alt={destaqueMateria.title}
                        className="je-featured__image"
                    />
                    <div className="je-featured__content">
                        <span className="je-featured__badge">Destaque</span>
                        <h2 className="je-featured__title">{destaqueMateria.title}</h2>
                        <p className="je-featured__desc">{destaqueMateria.desc}</p>
                        <div className="je-featured__meta">
                            <span className="je-featured__meta-item">👤 {destaqueMateria.author}</span>
                            <span className="je-featured__meta-item">📅 {destaqueMateria.date}</span>
                        </div>
                        <a href={destaqueMateria.link} className="je-featured__link">
                            Ler matéria completa →
                        </a>
                    </div>
                </div>

                {/* GRID DE MATÉRIAS — sem imagem, com badge de categoria */}
                <div className="je-grid">
                    {materias.map((m) => (
                        <div className="je-card" key={m.id}>
                            <div className="je-card__content">
                                <span className="je-card__badge">{m.category}</span>
                                <p className="je-card__title">{m.title}</p>
                                <p className="je-card__desc">{m.desc}</p>
                                <div className="je-card__meta">
                                    <span className="je-card__meta-item">👤 {m.author}</span>
                                    <span className="je-card__meta-item">📅 {m.date}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* BOTÃO VER TODAS */}
                <div className="je-footer">
                    <a href="/jornal" className="je-footer__btn">
                        Ver todas as matérias
                    </a>
                </div>

            </div>
        </section>
    );
}