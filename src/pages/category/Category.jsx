import { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { categories } from '../../data/categories';
import { getAllWorks } from '../../services/workService';
import { IconPencil, IconCalendar, IconHeart, IconMessage, IconDoc, IconSearch, IconBookmark } from '../../components/icons';
import './Category.css';

const typeMap = {
  'redacoes': 'Essay',
  'cordeis': 'Cordel',
  'contos': 'Tale',
  'cronicas': 'ShortStory',
  'infograficos': 'Infographic',
  'artes': 'Art',
  'videos': 'Multimedia',
  'libras': 'LibraLiterature',
  'jornal': 'Article'
};

const typeLabels = {
  'Essay': 'redação redações ensaio ensaios',
  'Cordel': 'cordel cordéis cordeis literatura',
  'Tale': 'conto contos tale',
  'ShortStory': 'crônica crônicas cronica cronicas',
  'Infographic': 'infográfico infografico infográficos infograficos',
  'Art': 'arte artes visual',
  'Multimedia': 'multimídia multimidia video vídeo videos vídeos',
  'LibraLiterature': 'libras literatura',
  'Article': 'artigo artigos jornal notícia noticia',
};

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

  const savedIds = JSON.parse(localStorage.getItem('savedPosts') || '[]');

  useEffect(() => {
    async function fetchWorks() {
      try {
        setLoading(true);
        setError('');
        if (isSearchMode) {
          const data = await getAllWorks();
          setWorks(data);
        } else {
          if (!currentCategory) return;
          const backendType = typeMap[id];
          const data = await getAllWorks(backendType);
          setWorks(data);
        }
      } catch (err) {
        console.error('Erro ao buscar obras:', err);
        setError('Não foi possível carregar as publicações.');
      } finally {
        setLoading(false);
      }
    }
    fetchWorks();
  }, [id, isSearchMode, currentCategory]);

  useEffect(() => {
    setSearch(queryFromHero);
  }, [queryFromHero]);

  const filtered = works.filter((w) => {
    if (!search) return true;
    const q = search.toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // remove acentos da busca
    const normalize = (str) =>
        (str ?? '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');

    const typeTranslation = typeLabels[w.type] ?? '';

    return (
        normalize(w.title).includes(q) ||
        normalize(w.author).includes(q) ||
        normalize(w.description).includes(q) ||
        normalize(w.type).includes(q) ||
        normalize(typeTranslation).includes(q)
    );
  });

  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleDateString('pt-BR');
  };

  if (!isSearchMode && !currentCategory) {
    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f6f7f9' }}>
          <Header />
          <section style={{ flex: 1, padding: '80px 20px', textAlign: 'center', color: '#0a2a57' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, fontFamily: 'Poppins, system-ui, sans-serif' }}>
              Categoria não encontrada
            </h1>
            <Link to="/" style={{ color: '#d62828', fontWeight: 600, marginTop: 16, display: 'inline-block' }}>
              ← Voltar à home
            </Link>
          </section>
          <Footer />
        </main>
    );
  }

  const heroTitle = isSearchMode ? 'Busca no Acervo' : currentCategory.title;
  const heroIcon = isSearchMode ? null : currentCategory.icon;
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
                  onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
          <p className="category-hero__label">
            {isSearchMode ? 'Acervo completo' : 'Seção da Biblioteca'}
          </p>
          <h1>{heroTitle}</h1>
          <p>
            {loading
                ? 'Buscando publicações...'
                : search
                    ? `${filtered.length} resultado${filtered.length !== 1 ? 's' : ''} para "${search}"`
                    : `${works.length} publicaç${works.length !== 1 ? 'ões' : 'ão'}`}
          </p>
        </section>

        <section className="category-content">
          {loading ? (
              <div className="empty-state">
                <p>Carregando publicações...</p>
              </div>
          ) : error ? (
              <div className="empty-state">
                <p style={{ color: '#d62828' }}>{error}</p>
              </div>
          ) : filtered.length === 0 ? (
              <div className="empty-state">
            <span className="empty-state__icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <IconDoc size={48} color="#94a3b8" />
            </span>
                <p>{search ? 'Nenhum resultado encontrado.' : 'Nenhuma publicação ainda.'}</p>
                <p style={{ fontSize: 13, marginTop: 8 }}>
                  {search ? 'Tente outros termos de busca.' : 'Em breve novos conteúdos serão adicionados aqui.'}
                </p>
              </div>
          ) : (
              <div className="posts-grid">
                {filtered.map((post) => {
                  const isSaved = savedIds.includes(post.id);
                  const categoryId = isSearchMode
                      ? Object.keys(typeMap).find((k) => typeMap[k] === post.type) ?? 'redacoes'
                      : id;

                  return (
                      <Link to={`/${categoryId}/${post.id}`} key={post.id} className="post-card">
                        {post.url && (
                            <img src={post.url} alt={post.title} className="post-card-image" />
                        )}
                        <span className="post-card-category">
                    {isSearchMode
                        ? categories.find((c) => typeMap[c.id] === post.type)?.title ?? post.type
                        : currentCategory.title}
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
                          <span
                              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                              className={isSaved ? 'post-card-stat--saved' : ''}
                          >
                      <IconBookmark size={14} color={isSaved ? '#0a2a57' : '#6b778c'} />
                    </span>
                        </div>
                      </Link>
                  );
                })}
              </div>
          )}
        </section>

        <Footer />
      </main>
  );
}