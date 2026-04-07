import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { getPostById } from '../../data/posts';
import { IconHeart, IconMessage } from '../../components/icons';
import './PostDetail.css';

export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = getPostById(id);

  const [likes, setLikes] = useState(post?.initialLikes ?? 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState(post?.initialComments ?? []);
  const [newComment, setNewComment] = useState('');

  if (!post) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f6f7f9' }}>
        <Header />
        <section style={{ flex: 1, padding: '80px 20px', textAlign: 'center', color: '#0a2a57' }}>
          <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: '2rem' }}>Post não encontrado</h1>
          <button
            onClick={() => navigate(-1)}
            style={{ marginTop: 20, cursor: 'pointer', background: '#d62828', color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 8, fontFamily: 'Poppins, system-ui, sans-serif', fontWeight: 700 }}
          >
            Voltar
          </button>
        </section>
        <Footer />
      </main>
    );
  }

  const handleLike = () => {
    if (hasLiked) {
      setLikes((l) => l - 1);
      setHasLiked(false);
    } else {
      setLikes((l) => l + 1);
      setHasLiked(true);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim() === '') return;
    setComments((prev) => [
      ...prev,
      { id: Date.now(), author: 'Visitante', text: newComment },
    ]);
    setNewComment('');
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f6f7f9' }}>
      <Header />
      <section className="post-container">
        <article className="post-content">
          <Link to={-1} className="post-back">Voltar</Link>
          
          <div className="post-header">
            <span className="post-category">{post.category}</span>
            <h1 className="post-title">{post.title}</h1>
            <span className="post-meta">Por {post.author} em {post.date}</span>
          </div>

          {/* Renderização Condicional da Imagem no Detalhe */}
          {post.image && (
            <img src={post.image} alt={post.title} className="post-hero-image" />
          )}

          <div className="post-body">{post.content}</div>
          
          <div className="post-interactions">
            <button className={`like-btn ${hasLiked ? 'liked' : ''}`} onClick={handleLike} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconHeart size={20} color={hasLiked ? '#d62828' : 'currentColor'} /> 
              {likes} Curtidas
            </button>
            <span className="btn-interact" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconMessage size={20} /> 
              {comments.length} Comentários
            </span>
          </div>
        </article>

        <section className="comments-section">
          <h2>Comentários</h2>
          {comments.length > 0 ? (
            <div className="comment-list">
              {comments.map((comment) => (
                <div key={comment.id} className="comment-item">
                  <div className="comment-author">{comment.author}</div>
                  <div className="comment-text">{comment.text}</div>
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b778c', marginBottom: 24, fontFamily: 'Poppins, system-ui, sans-serif' }}>
              Seja o primeiro a comentar!
            </p>
          )}
          <form className="comment-form" onSubmit={handleAddComment}>
            <textarea
              placeholder="Escreva um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <button type="submit" className="comment-submit-btn">Enviar Comentário</button>
          </form>
        </section>
      </section>
      <Footer />
    </main>
  );
}