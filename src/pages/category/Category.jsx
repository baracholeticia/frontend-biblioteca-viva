import { useParams, Link } from 'react-router-dom';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { categories } from '../../data/categories';
import { getPostsByCategory } from '../../data/posts';
import { IconPencil, IconCalendar, IconHeart, IconMessage, IconDoc } from '../../components/icons';
import './Category.css';

export function Category() {
  const { id } = useParams();
  const currentCategory = categories.find((cat) => cat.id === id);
  const categoryPosts = getPostsByCategory(id);

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
        <p>{categoryPosts.length > 0 ? `${categoryPosts.length} publicações` : 'Nenhuma publicação ainda'}</p>
      </section>

      <section className="category-content">
        {categoryPosts.length === 0 ? (
          <div className="empty-state">
            <span className="empty-state__icon" style={{ display: 'flex', justifyContent: 'center', marginBottom: 16 }}>
              <IconDoc size={48} color="#94a3b8" />
            </span>
            <p>Nenhuma publicação ainda nesta categoria.</p>
            <p style={{ fontSize: 13, marginTop: 8 }}>Em breve novos conteúdos serão adicionados aqui.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {categoryPosts.map((post) => (
              <Link
                to={`/${id}/${post.id}`}
                key={post.id}
                className="post-card"
              >
                {/* Renderização Condicional da Imagem */}
                {post.image && (
                  <img src={post.image} alt={post.title} className="post-card-image" />
                )}
                
                <span className="post-card-category">{post.category}</span>
                <h2 className="post-card-title">{post.title}</h2>
                <p className="post-card-excerpt">{post.excerpt}</p>
                
                <div className="post-card-footer">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconPencil size={14} /> {post.author}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconCalendar size={14} /> {post.date}
                  </span>
                </div>
                
                <div className="post-card-stats">
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconHeart size={14} color="#d62828" /> {post.initialLikes}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <IconMessage size={14} /> {post.initialComments.length}
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