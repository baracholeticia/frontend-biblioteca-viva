import { useState, useMemo } from 'react';
import './PesquisarConteudo.css';

const mockItems = [
    {
        id: 1,
        title: 'Perspectivas acerca do envelhecimento na sociedade brasileira',
        excerpt: 'O envelhecimento populacional é uma realidade crescente no Brasil...',
        author: 'Maria Silva',
        genero: 'Redação',
        data: '30/11/2024',
        dataISO: '2024-11-30',
        views: 245,
    },
    {
        id: 2,
        title: 'A Última Flor do Lácio',
        excerpt: 'Em meio ao caos urbano, a língua portuguesa resiste e floresce...',
        author: 'João Santos',
        genero: 'Conto',
        data: '04/12/2024',
        dataISO: '2024-12-04',
        views: 187,
    },
    {
        id: 3,
        title: 'Desafios da educação no Brasil contemporâneo',
        excerpt: 'A educação pública enfrenta desafios estruturais que vão além da sala de aula...',
        author: 'Ana Costa',
        genero: 'Redação',
        data: '10/01/2025',
        dataISO: '2025-01-10',
        views: 312,
    },
    {
        id: 4,
        title: 'Cordel da Seca e da Esperança',
        excerpt: 'No sertão que range e grita, a esperança ainda habita...',
        author: 'Lucas Mendes',
        genero: 'Cordel',
        data: '20/02/2025',
        dataISO: '2025-02-20',
        views: 98,
    },
    {
        id: 5,
        title: 'Segunda de manhã no sertão',
        excerpt: 'O sol ainda não havia rompido o horizonte quando Dona Zefinha acendeu o fogão...',
        author: 'Pedro Lima',
        genero: 'Crônica',
        data: '15/01/2025',
        dataISO: '2025-01-15',
        views: 134,
    },
];

const TIPOS = ['Todos', 'Redações', 'Contos', 'Crônicas', 'Cordéis'];

const generoMap = {
    Todos: null,
    Redações: 'Redação',
    Contos: 'Conto',
    Crônicas: 'Crônica',
    Cordéis: 'Cordel',
};

const badgeColor = {
    Redação: 'badge--blue',
    Conto: 'badge--yellow',
    Crônica: 'badge--green',
    Cordel: 'badge--purple',
};

/* ── ICONS ── */
function IconSearch() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    );
}

function IconEye() {
    return (
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
        </svg>
    );
}

function IconDownload() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
    );
}

function IconFile() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
        </svg>
    );
}

function IconBook() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" /><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
        </svg>
    );
}

function IconLayout() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
    );
}

function IconScroll() {
    return (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" /><polyline points="14 2 14 8 20 8" /><line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="16" y2="17" />
        </svg>
    );
}

const tipoIcons = {
    Todos: <IconSearch />,
    Redações: <IconFile />,
    Contos: <IconBook />,
    Crônicas: <IconLayout />,
    Cordéis: <IconScroll />,
};

export function PesquisarConteudo() {
    const [query, setQuery] = useState('');
    const [activeType, setActiveType] = useState('Todos');
    const [generoFilter, setGeneroFilter] = useState('');
    const [periodoFilter, setPeriodoFilter] = useState('');
    const [ordenar, setOrdenar] = useState('recentes');
    const [searched, setSearched] = useState(true);

    const results = useMemo(() => {
        let list = [...mockItems];

        // filtro por tipo/tab
        const generoTarget = generoMap[activeType];
        if (generoTarget) list = list.filter(i => i.genero === generoTarget);

        // filtro por gênero (select)
        if (generoFilter) list = list.filter(i => i.genero === generoFilter);

        // filtro por texto
        if (query.trim()) {
            const q = query.toLowerCase();
            list = list.filter(i =>
                i.title.toLowerCase().includes(q) ||
                i.author.toLowerCase().includes(q) ||
                i.excerpt.toLowerCase().includes(q)
            );
        }

        // filtro por período
        if (periodoFilter === '2024') list = list.filter(i => i.dataISO.startsWith('2024'));
        if (periodoFilter === '2025') list = list.filter(i => i.dataISO.startsWith('2025'));

        // ordenar
        if (ordenar === 'recentes') list.sort((a, b) => b.dataISO.localeCompare(a.dataISO));
        if (ordenar === 'antigos') list.sort((a, b) => a.dataISO.localeCompare(b.dataISO));
        if (ordenar === 'visualizacoes') list.sort((a, b) => b.views - a.views);

        return list;
    }, [query, activeType, generoFilter, periodoFilter, ordenar]);

    return (
        <div className="pc-wrap">

            {/* BANNER */}
            <div className="pc-banner">
                <h1 className="pc-banner__title">PAINEL ADMINISTRATIVO</h1>
                <p className="pc-banner__sub">Pesquise conteúdos publicados na biblioteca</p>
            </div>

            {/* SEARCH BOX */}
            <div className="pc-search-card">
                <div className="pc-search-row">
                    <div className="pc-search-input-wrap">
                        <IconSearch />
                        <input
                            className="pc-search-input"
                            type="text"
                            placeholder="Buscar por título, autor ou palavras-chave..."
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && setSearched(true)}
                        />
                    </div>
                    <button className="pc-search-btn" onClick={() => setSearched(true)}>
                        <IconSearch /> Pesquisar
                    </button>
                </div>

                {/* TIPO TABS */}
                <div className="pc-types">
                    {TIPOS.map(tipo => (
                        <button
                            key={tipo}
                            className={`pc-type-btn ${activeType === tipo ? 'pc-type-btn--active' : ''}`}
                            onClick={() => setActiveType(tipo)}
                        >
                            {tipoIcons[tipo]} {tipo}
                        </button>
                    ))}
                </div>

                {/* FILTERS */}
                <div className="pc-filters">
                    <div className="pc-filter-group">
                        <label className="pc-filter-label">Gênero</label>
                        <select className="pc-select" value={generoFilter} onChange={e => setGeneroFilter(e.target.value)}>
                            <option value="">Todos os gêneros</option>
                            <option value="Redação">Redação</option>
                            <option value="Conto">Conto</option>
                            <option value="Crônica">Crônica</option>
                            <option value="Cordel">Cordel</option>
                        </select>
                    </div>
                    <div className="pc-filter-group">
                        <label className="pc-filter-label">Período</label>
                        <select className="pc-select" value={periodoFilter} onChange={e => setPeriodoFilter(e.target.value)}>
                            <option value="">Todos os períodos</option>
                            <option value="2024">2024</option>
                            <option value="2025">2025</option>
                        </select>
                    </div>
                    <div className="pc-filter-group">
                        <label className="pc-filter-label">Ordenar por</label>
                        <select className="pc-select" value={ordenar} onChange={e => setOrdenar(e.target.value)}>
                            <option value="recentes">Mais recentes</option>
                            <option value="antigos">Mais antigos</option>
                            <option value="visualizacoes">Mais visualizados</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* RESULTS */}
            {searched && (
                <div className="pc-results-card">
                    <div className="pc-results-header">
                        <h2 className="pc-results-title">Resultados da Pesquisa</h2>
                        <div className="pc-results-meta">
                            <span className="pc-results-count">{results.length} resultado{results.length !== 1 ? 's' : ''} encontrado{results.length !== 1 ? 's' : ''}</span>
                            <button className="pc-export-btn"><IconDownload /> Exportar</button>
                        </div>
                    </div>

                    <div className="pc-list">
                        {results.length === 0 ? (
                            <p className="pc-empty">Nenhum resultado encontrado.</p>
                        ) : results.map(item => (
                            <div className="pc-item" key={item.id}>
                                <div className="pc-item__main">
                                    <div className="pc-item__top">
                                        <h3 className="pc-item__title">{item.title}</h3>
                                        <span className={`pc-badge ${badgeColor[item.genero]}`}>{item.genero}</span>
                                    </div>
                                    <p className="pc-item__excerpt">{item.excerpt}</p>
                                    <div className="pc-item__meta">
                                        <span>Autor: {item.author}</span>
                                        <span>Gênero: {item.genero}</span>
                                        <span>Publicado em: {item.data}</span>
                                        <span className="pc-item__views"><IconEye /> {item.views} visualizações</span>
                                    </div>
                                </div>
                                <button className="pc-detail-btn">Ver Detalhes</button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}