import { useParams, Link } from 'react-router-dom';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { categories } from '../../data/categories';
import { getPostsByCategory } from '../../data/posts';
import './Category.css';

export function Category() {
  const { id } = useParams();

  const currentCategory = categories.find(cat => cat.id === id);
  const categoryPosts = getPostsByCategory(id);

  if (!currentCategory) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <section style={{ flex: 1, padding: '80px 20px', textAlign: 'center', color: '#0a2a57' }}>
          <h1 style={{ fontSize: '42px', fontWeight: 'bold' }}>Categoria não encontrada</h1>
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
        <p>{categoryPosts.length} publicações</p>
      </section>

      <section className="category-content">
        {categoryPosts.length === 0 ? (
          <div className="empty-state">
            <span>📭</span>
            <p>Nenhuma publicação ainda nesta categoria.</p>
          </div>
        ) : (
          <div className="posts-grid">
            {categoryPosts.map(post => (
              <Link
                to={`/${id}/${post.id}`}
                key={post.id}
                className="post-card"
              >
                <div className="post-card-header">
                  <span className="post-card-category">{post.category}</span>
                </div>
                <h2 className="post-card-title">{post.title}</h2>
                <p className="post-card-excerpt">{post.excerpt}</p>
                <div className="post-card-footer">
                  <span className="post-card-author">✍️ {post.author}</span>
                  <span className="post-card-date">📅 {post.date}</span>
                </div>
                <div className="post-card-stats">
                  <span>❤️ {post.initialLikes}</span>
                  <span>💬 {post.initialComments.length}</span>
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