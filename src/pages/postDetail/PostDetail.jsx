import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { getWorkById, likeWork } from '../../services/workService';
import { getComments, createComment } from '../../services/commentService';
import { isLoggedIn } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import { IconHeart, IconMessage, IconBookmark } from '../../components/icons';
import './PostDetail.css';

const categoryTranslations = {
  'Essay': 'Redações Nota 10',
  'Cordel': 'Cordéis',
  'Tale': 'Contos',
  'ShortStory': 'Crônicas',
  'Article': 'Jornal da Escola',
  'Infographic': 'Infográficos',
  'Art': 'Galeria de Artes',
  'Multimedia': 'Vídeos Autorais',
  'LibraLiterature': 'Literatura em Libras'
};

const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
  return match ? match[1] : null;
};

function getSavedIds() {
  return JSON.parse(localStorage.getItem('savedPosts') || '[]');
}

function toggleSaved(postId) {
  const saved = getSavedIds();
  const updated = saved.includes(postId)
      ? saved.filter((i) => i !== postId)
      : [...saved, postId];
  localStorage.setItem('savedPosts', JSON.stringify(updated));
  return updated.includes(postId);
}

export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [newComment, setNewComment] = useState('');
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setIsSaved(getSavedIds().includes(id));
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError('');
        const [postData, commentsData] = await Promise.all([
          getWorkById(id),
          getComments(id).catch(() => [])
        ]);
        setPost(postData);
        setComments(commentsData || []);
        setLikes(postData.likeCount || 0);
      } catch (err) {
        console.error("Erro ao buscar dados do post:", err);
        setError('Post não encontrado ou erro de conexão com o servidor.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  const handleSave = () => {
    if (!isLoggedIn()) {
      showToast('Você precisa estar logado para salvar.', 'error');
      navigate('/login');
      return;
    }
    const nowSaved = toggleSaved(id);
    setIsSaved(nowSaved);
    showToast(nowSaved ? 'Post salvo nos favoritos!' : 'Post removido dos favoritos.', 'success');
  };

  const handleLike = async () => {
    if (!isLoggedIn()) {
      showToast('Você precisa estar logado para curtir.', 'error');
      navigate('/login');
      return;
    }
    if (isLiking) return;
    setIsLiking(true);
    try {
      await likeWork(id);
      if (hasLiked) {
        setLikes((l) => l - 1);
        setHasLiked(false);
      } else {
        setLikes((l) => l + 1);
        setHasLiked(true);
      }
    } catch (err) {
      console.error("Erro ao curtir:", err);
      showToast('Não foi possível registrar a curtida.', 'error');
    } finally {
      setIsLiking(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!isLoggedIn()) {
      showToast('Você precisa estar logado para comentar.', 'error');
      navigate('/login');
      return;
    }
    if (newComment.trim() === '') return;
    setIsCommenting(true);
    try {
      await createComment(id, newComment);
      setNewComment('');
      showToast('Comentário enviado!', 'success');
      const updatedComments = await getComments(id);
      setComments(updatedComments);
    } catch (err) {
      console.error("Erro ao enviar comentário:", err);
      showToast('Erro ao enviar o comentário. Tente novamente.', 'error');
    } finally {
      setIsCommenting(false);
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleDateString('pt-BR', {
      day: '2-digit', month: 'long', year: 'numeric'
    });
  };

  if (loading) {
    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f6f7f9' }}>
          <Header />
          <section style={{ flex: 1, padding: '80px 20px', textAlign: 'center', color: '#0a2a57' }}>
            <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: '1.5rem' }}>Carregando...</h1>
          </section>
          <Footer />
        </main>
    );
  }

  if (error || !post) {
    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f6f7f9' }}>
          <Header />
          <section style={{ flex: 1, padding: '80px 20px', textAlign: 'center', color: '#0a2a57' }}>
            <h1 style={{ fontFamily: 'Poppins, system-ui, sans-serif', fontSize: '2rem' }}>{error}</h1>
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

  const translatedCategory = categoryTranslations[post.type] || post.type;
  const youtubeId = getYouTubeId(post.url);

  return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f6f7f9' }}>
        <Header />
        <section className="post-container">
          <article className="post-content">
            <button onClick={() => navigate(-1)} className="post-back" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
              ← Voltar
            </button>

            <div className="post-header">
              <span className="post-category">{translatedCategory}</span>
              <h1 className="post-title">{post.title}</h1>
              <span className="post-meta">Por {post.author} em {formatDate(post.publicationDate)}</span>
            </div>

            {youtubeId ? (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', marginBottom: 32, borderRadius: 12 }}>
                  <iframe
                      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 12 }}
                      src={`https://www.youtube.com/embed/${youtubeId}`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                  />
                </div>
            ) : (
                post.url && !imageError && (
                    <img
                        src={post.url}
                        alt={post.title}
                        className="post-hero-image"
                        onError={() => setImageError(true)}
                    />
                )
            )}

            {post.content && (
                <div className="post-body">{post.content}</div>
            )}

            {!post.content && post.description && (
                <div className="post-body">{post.description}</div>
            )}

            <div className="post-interactions">
              <button
                  className={`like-btn ${hasLiked ? 'liked' : ''}`}
                  onClick={handleLike}
                  disabled={isLiking}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <IconHeart size={20} color={hasLiked ? "#d62828" : "#6b778c"} filled={hasLiked} />
                {likes} Curtidas
              </button>

              <span className="btn-interact" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <IconMessage size={20} />
                {comments.length} Comentários
            </span>

              <button
                  className={`save-btn ${isSaved ? 'save-btn--saved' : ''}`}
                  onClick={handleSave}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <IconBookmark size={20} color={isSaved ? '#0a2a57' : '#6b778c'} />
                {isSaved ? 'Salvo' : 'Salvar'}
              </button>
            </div>
          </article>

          <section className="comments-section">
            <h2>Comentários</h2>
            {comments.length > 0 ? (
                <div className="comment-list">
                  {comments.map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-author">
                          {comment.authorName}
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginLeft: '8px', fontWeight: 'normal' }}>
                      {formatDate(comment.createdAt)}
                    </span>
                        </div>
                        <div className="comment-text">{comment.content}</div>
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
                disabled={isCommenting}
            />
              <button type="submit" className="comment-submit-btn" disabled={isCommenting}>
                {isCommenting ? 'Enviando...' : 'Enviar Comentário'}
              </button>
            </form>
          </section>
        </section>
        <Footer />
      </main>
  );
}