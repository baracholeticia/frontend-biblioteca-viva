import { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { categories } from '../../data/categories';
import { getAllWorks } from '../../services/workService';
import { getAllBookClubs } from '../../services/bookclubService';
import { IconPencil, IconCalendar, IconHeart, IconMessage, IconDoc, IconSearch, IconBookmark } from '../../components/icons';
import { Pagination } from '../../components/pagination/Pagination';
import './Category.css';

const typeMap = {
    'redacoes':    'Essay',
    'cordeis':     'Cordel',
    'contos':      'Tale',
    'cronicas':    'ShortStory',
    'poemas':      'Poem',
    'infograficos':'Infographic',
    'artes':       'Art',
    'videos':      'Multimedia',
    'libras':      'LibraLiterature',
    'jornal':      'Article'
};

const typeLabels = {
    'Essay':           'redacao redacoes ensaio ensaios nota10 nota 10',
    'Cordel':          'cordel cordeis literatura nordeste',
    'Tale':            'conto contos tale historia historias',
    'ShortStory':      'cronica cronicas short story',
    'Poem':            'poema poemas poesia poesias verso versos',
    'Infographic':     'infografico infograficos grafico graficos dados',
    'Art':             'arte artes visual galeria pintura desenho',
    'Multimedia':      'multimidia video videos autoral autorais youtube',
    'LibraLiterature': 'libras literatura sinais surdo surdos',
    'Article':         'artigo artigos jornal noticia noticias escola',
    'BookClub':        'clube leitura livro livros encontro book club',
};

const getYouTubeId = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
    return match ? match[1] : null;
};

const getThumbnailUrl = (url) => {
    const ytId = getYouTubeId(url);
    return ytId ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` : url;
};

const norm = (str) =>
    (str ?? '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim();

function matchesSearch(post, query) {
    if (!query) return true;
    const words = norm(query).split(/\s+/).filter(Boolean);
    const fields = [
        norm(post.title),
        norm(post.author),
        norm(post.description),
        norm(typeLabels[post.type] ?? ''),
        norm(post.type),
    ].join(' ');
    return words.every(word => fields.includes(word));
}

export function Category() {
    const { id } = useParams();
    const [searchParams] = useSearchParams();
    const queryFromHero = searchParams.get('search') ?? '';

    const isSearchMode = !id;
    const currentCategory = categories.find((cat) => cat.id === id);

    const [works, setWorks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [search, setSearch] = useState(queryFromHero);
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage, setPerPage] = useState(12);

    const userEmail = localStorage.getItem('userEmail') || 'guest';
    const savedIds = JSON.parse(localStorage.getItem(`savedPosts_${userEmail}`) || '[]');

    useEffect(() => {
        async function fetchWorks() {
            try {
                setLoading(true);
                setError('');

                if (isSearchMode) {
                    const [worksData, clubData] = await Promise.all([
                        getAllWorks(),
                        getAllBookClubs().catch(() => []),
                    ]);
                    const clubsArray = clubData.content || clubData;
                    const mappedClubs = (Array.isArray(clubsArray) ? clubsArray : []).map(bc => ({
                        id: bc.id,
                        type: 'BookClub',
                        title: bc.bookName,
                        author: bc.organizerName || bc.bookAuthor,
                        description: bc.bookSynopses,
                        url: bc.bookCoverUrl,
                        publicationDate: bc.date,
                        likeCount: bc.averageRating || 0,
                        commentCount: bc.participantsCount || 0,
                    }));
                    setWorks([...(worksData || []), ...mappedClubs]);

                } else if (id === 'clube-leitura') {
                    const clubData = await getAllBookClubs();
                    const clubsArray = clubData.content || clubData;
                    const mappedClubs = (Array.isArray(clubsArray) ? clubsArray : []).map(bc => ({
                        id: bc.id,
                        type: 'BookClub',
                        title: bc.bookName,
                        author: bc.organizerName || bc.bookAuthor,
                        description: bc.bookSynopses,
                        url: bc.bookCoverUrl,
                        publicationDate: bc.date,
                        likeCount: bc.averageRating || 0,
                        commentCount: bc.participantsCount || 0,
                    }));
                    setWorks(mappedClubs);

                } else {
                    if (!currentCategory) return;
                    const data = await getAllWorks(typeMap[id]);
                    setWorks(data);
                }
            } catch (err) {
                console.error('Erro ao buscar publicações:', err);
                setError('Não foi possível carregar as publicações.');
            } finally {
                setLoading(false);
            }
        }
        fetchWorks();
    }, [id, isSearchMode, currentCategory]);

    useEffect(() => {
        setSearch(queryFromHero);
        setCurrentPage(1);
    }, [queryFromHero]);

    const filtered = useMemo(() =>
            works.filter(w => matchesSearch(w, search)),
        [works, search]
    );

    const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
    const safePage = Math.min(currentPage, totalPages);
    const paginated = filtered.slice((safePage - 1) * perPage, safePage * perPage);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };
    const handlePerPageChange = (value) => { setPerPage(value); setCurrentPage(1); };

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        return new Date(isoDate).toLocaleDateString('pt-BR');
    };

    if (!isSearchMode && !currentCategory) {
        return (
            <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f6f7f9' }}>
                <Header />
                <section style={{ flex: 1, padding: '80px 20px', textAlign: 'center', color: '#0a2a57' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'Poppins, system-ui, sans-serif' }}>Categoria não encontrada</h1>
                    <Link to="/" style={{ color: '#d62828', fontWeight: 600, marginTop: 16, display: 'inline-block' }}>← Voltar à home</Link>
                </section>
                <Footer />
            </main>
        );
    }

    const heroTitle = isSearchMode ? 'Busca no Acervo' : currentCategory.title;
    const heroIcon  = isSearchMode ? null : currentCategory.icon;
    const heroColor = isSearchMode ? 'cat-blue' : currentCategory.color;

    return (
        <main style={{ backgroundColor: '#f6f7f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
            <Header />
            <section className="category-hero">
                <div className="category-hero__top">
                    {heroIcon && (
                        <div className={`category-icon-lg ${heroColor}`}>
                            {heroIcon}
                        </div>
                    )}
                    <div className="category-search-wrap">
                        <IconSearch size={16} color="#94a3b8" />
                        <input
                            className="category-search"
                            type="text"
                            placeholder={isSearchMode ? 'Buscar em todo o acervo...' : 'Buscar por título, autor...'}
                            value={search}
                            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
                        />
                        {search && (
                            <button
                                onClick={() => { setSearch(''); setCurrentPage(1); }}
                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: 18, lineHeight: 1, padding: 0 }}
                            >
                                ×
                            </button>
                        )}
                    </div>
                </div>
                <p className="category-hero__label">
                    {isSearchMode ? 'Acervo completo' : 'Seção da Biblioteca'}
                </p>
                <h1>{heroTitle}</h1>
            </section>

            <section className="category-content">
                {loading ? (
                    <div className="empty-state"><p>Carregando publicações...</p></div>
                ) : error ? (
                    <div className="empty-state"><p style={{ color: '#d62828' }}>{error}</p></div>
                ) : filtered.length === 0 ? (
                    <div className="empty-state">
                        <span className="empty-state__icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
                            <IconDoc size={48} color="#94a3b8" />
                        </span>
                        <p>{search ? 'Nenhum resultado encontrado.' : 'Nenhuma publicação ainda.'}</p>
                        {search && (
                            <button
                                onClick={() => setSearch('')}
                                style={{ marginTop: 12, color: '#d62828', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, fontFamily: 'Poppins, system-ui, sans-serif' }}
                            >
                                Limpar busca
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="category-content-inner">
                        <div className="posts-grid">
                            {paginated.map((post) => {
                                const isSaved = savedIds.includes(post.id);
                                const categoryId = isSearchMode
                                    ? (post.type === 'BookClub' ? 'clube-leitura' : Object.keys(typeMap).find((k) => typeMap[k] === post.type) ?? 'redacoes')
                                    : id;
                                const finalImageUrl = getThumbnailUrl(post.url);

                                return (
                                    <Link to={`/${categoryId}/${post.id}`} key={post.id} className="post-card">
                                        {finalImageUrl && (
                                            <img src={finalImageUrl} alt={post.title} className="post-card-image" />
                                        )}
                                        <span className="post-card-category">
                                            {post.type === 'BookClub' ? 'Clube de Leitura' : (categories.find((c) => typeMap[c.id] === post.type)?.title ?? post.type)}
                                        </span>
                                        <h2 className="post-card-title">{post.title}</h2>
                                        <p className="post-card-excerpt">{post.description}</p>
                                        <div className="post-card-footer">
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <IconPencil size={14} /> {post.author}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <IconCalendar size={14} /> {formatDate(post.publicationDate)}
                                            </span>
                                        </div>
                                        <div className="post-card-stats">
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <IconHeart size={14} color="#d62828" /> {post.likeCount || 0}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                                <IconMessage size={14} /> {post.commentCount || 0}
                                            </span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }} className={isSaved ? 'post-card-stat--saved' : ''}>
                                                <IconBookmark size={14} color={isSaved ? '#0a2a57' : '#6b778c'} />
                                            </span>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                        <div className="category-pagination">
                            <Pagination
                                currentPage={safePage}
                                totalPages={totalPages}
                                totalItems={filtered.length}
                                perPage={perPage}
                                onPageChange={handlePageChange}
                                onPerPageChange={handlePerPageChange}
                            />
                        </div>
                    </div>
                )}
            </section>
            <Footer />
        </main>
    );
}