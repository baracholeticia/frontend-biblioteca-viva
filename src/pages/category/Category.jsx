import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { categories } from '../../data/categories';
import { getAllWorks } from '../../services/workService';
import { IconPencil, IconCalendar, IconHeart, IconMessage, IconDoc } from '../../components/icons';
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

export function Category() {
  const { id } = useParams();
  const currentCategory = categories.find((cat) => cat.id === id);
  
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchCategoryWorks() {
      if (!currentCategory) return;
      
      try {
        setLoading(true);
        setError('');
        const backendType = typeMap[id];
        // Busca as obras filtrando pelo tipo no back-end
        const data = await getAllWorks(backendType);
        setWorks(data);
      } catch (err) {
        console.error("Erro ao buscar obras da categoria:", err);
        setError('Não foi possível carregar as publicações desta categoria.');
      } finally {
        setLoading(false);
      }
    }

    fetchCategoryWorks();
  }, [id, currentCategory]);

  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleDateString('pt-BR');
  };

  if (!currentCategory) {
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

  return (
    <main style={{ backgroundColor: '#f6f7f9', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />

      <section className="category-hero">
        <div className={`category-icon-lg ${currentCategory.color}`}>
          {currentCategory.icon}
        </div>
        <h1>{currentCategory.title}</h1>
        <p>{works.length > 0 ? `${works.length} publicações` : 'Buscando publicações...'}</p>
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
        ) : works.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <IconDoc size={48} color="#94a3b8" />
            </span>
            <p>Nenhuma publicação ainda nesta categoria.</p>
            <p style={{ fontSize: 13, marginTop: 8 }}>Em breve novos conteúdos serão adicionados aqui.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {works.map((post) => (
              <Link to={`/${id}/${post.id}`} key={post.id} className="post-card">
                {post.url && (
                  <img src={post.url} alt={post.title} className="post-card-image" />
                )}
                
                <span className="post-card-category">{currentCategory.title}</span>
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
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}