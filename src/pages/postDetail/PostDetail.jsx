import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { getWorkById, likeWork, getLikedWorks } from '../../services/workService';
import { getComments, createComment } from '../../services/commentService';
import { getBookClubById, getBookClubReviews } from '../../services/bookclubService';
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
  'LibraLiterature': 'Literatura em Libras',
  'Poem': 'Poemas',
  'BookClub': 'Livro Analisado'
};

const getYouTubeId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})/);
  return match ? match[1] : null;
};

const getSavedKey = () => `savedPosts_${localStorage.getItem('userEmail') || 'guest'}`;

function getSavedIds() {
  return JSON.parse(localStorage.getItem(getSavedKey()) || '[]');
}

function toggleSaved(postId) {
  const saved = getSavedIds();
  const updated = saved.includes(postId)
      ? saved.filter((i) => i !== postId)
      : [...saved, postId];
  localStorage.setItem(getSavedKey(), JSON.stringify(updated));
  return updated.includes(postId);
}

export function PostDetail() {
  const { categoria, id } = useParams();
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

  const isBookClub = categoria === 'clube-leitura';

  useEffect(() => {
    setIsSaved(getSavedIds().includes(id));
  }, [id]);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        setError('');

        if (isBookClub) {
            const bc = await getBookClubById(id);
            const revs = await getBookClubReviews(id);
            setPost({
                ...bc,
                title: bc.bookName,
                author: bc.bookAuthor,
                description: bc.bookSynopses,
                url: bc.bookCoverUrl,
                type: 'BookClub',
                publicationDate: bc.date
            });
            setComments(revs.content || []);
            setLikes(bc.averageRating || 0); 
        } else {
            const [postData, commentsData] = await Promise.all([
                getWorkById(id),
                getComments(id).catch(() => [])
            ]);
            setPost(postData);
            setComments(commentsData || []);
            setLikes(postData.likeCount || 0);

            if (isLoggedIn()) {
                const likedList = await getLikedWorks().catch(() => []);
                setHasLiked(likedList.includes(id));
            }
        }
      } catch (err) {
        console.error("Erro ao buscar dados do post:", err);
        setError('Post não encontrado ou erro de conexão com o servidor.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id, isBookClub]);

  const handleSave = () => {
    if (!isLoggedIn()) {
      showToast('Você precisa estar logado para salvar.', 'error');
      navigate('/login');
      return;
    }
    const nowSaved = toggleSaved(id);
    setIsSaved(nowSaved);
    showToast(nowSaved ? 'Salvo nos favoritos!' : 'Removido dos favoritos.', 'success');
  };

  const handleLike = async () => {
    if (!isLoggedIn()) {
      showToast('Você precisa estar logado para curtir.', 'error');
      navigate('/login');
      return;
    }
    if (isBookClub) return; 
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
      showToast('Faça login para comentar.', 'error');
      navigate('/login');
      return;
    }
    if (newComment.trim() === '') return;
    setIsCommenting(true);
    try {
      if (isBookClub) {
          showToast('As avaliações do livro devem ser feitas pela aba Home.', 'error');
          setIsCommenting(false);
          return;
      }
      
      await createComment(id, newComment);
      setNewComment('');
      showToast('Comentário enviado!', 'success');
      const updatedComments = await getComments(id);
      setComments(updatedComments);
    } catch (err) {
      console.error("Erro ao enviar comentário:", err);
      showToast('Erro ao enviar. Tente novamente.', 'error');
    } finally {
      setIsCommenting(false);
    }
  };

  const formatTextWithLineBreaks = (text) => {
    if (!text) return null;
    return text.split(/\\n|\n/).map((line, index) => (
        <span key={index}>{line}<br /></span>
    ));
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    return new Date(isoDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
  };

  if (loading || error || !post) return null;

  const translatedCategory = categoryTranslations[post.type] || post.type;
  const youtubeId = getYouTubeId(post.url);

  return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f6f7f9' }}>
        <Header />
        <section className="post-container">
          <article className="post-content">
            <button onClick={() => navigate(-1)} className="post-back" style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>← Voltar</button>

            <div className="post-header">
              <span className="post-category">{translatedCategory}</span>
              <h1 className="post-title">{post.title}</h1>
              <span className="post-meta">Por {post.author} em {formatDate(post.publicationDate)}</span>
            </div>

            {youtubeId ? (
                <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', marginBottom: 32, borderRadius: 12 }}>
                  <iframe style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 12 }} src={`https://www.youtube.com/embed/${youtubeId}`} title="YouTube" frameBorder="0" allowFullScreen />
                </div>
            ) : (
                post.url && !imageError && (
                    <img src={post.url} alt={post.title} className="post-hero-image" onError={() => setImageError(true)} />
                )
            )}

            {post.content && <div className="post-body">{formatTextWithLineBreaks(post.content)}</div>}
            {!post.content && post.description && <div className="post-body">{formatTextWithLineBreaks(post.description)}</div>}

            <div className="post-interactions">
              {!isBookClub && (
                  <button className={`like-btn ${hasLiked ? 'liked' : ''}`} onClick={handleLike} disabled={isLiking} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <IconHeart size={20} color={hasLiked ? "#d62828" : "#6b778c"} filled={hasLiked} />
                    <span>{likes} <span className="interact-text">Curtidas</span></span>
                  </button>
              )}

              <span className="btn-interact" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconMessage size={20} /> 
                <span>{comments.length} <span className="interact-text">Comentários {isBookClub && "(Resenhas)"}</span></span>
              </span>

              <button className={`save-btn ${isSaved ? 'save-btn--saved' : ''}`} onClick={handleSave} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <IconBookmark size={20} color={isSaved ? '#0a2a57' : '#6b778c'} /> 
                <span className="interact-text">{isSaved ? 'Salvo' : 'Salvar'}</span>
              </button>
            </div>
          </article>

          <section className="comments-section">
            <h2>{isBookClub ? "Resenhas dos Leitores" : "Comentários"}</h2>
            {comments.length > 0 ? (
                <div className="comment-list">
                  {comments.map((comment) => (
                      <div key={comment.id} className="comment-item">
                        <div className="comment-author">
                          {comment.authorName}
                          {isBookClub && <span style={{marginLeft: 8, color: '#f5a623'}}>★ {comment.rating}</span>}
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginLeft: '8px', fontWeight: 'normal' }}>
                            {formatDate(comment.createdAt)}
                          </span>
                        </div>
                        <div className="comment-text">{comment.content}</div>
                      </div>
                  ))}
                </div>
            ) : (
                <p style={{ color: '#6b778c', marginBottom: 24, fontFamily: 'Poppins, system-ui, sans-serif' }}>Seja o primeiro a interagir!</p>
            )}
            
            {!isBookClub && (
                <form className="comment-form" onSubmit={handleAddComment}>
                    <textarea placeholder="Escreva um comentário..." value={newComment} onChange={(e) => setNewComment(e.target.value)} disabled={isCommenting} />
                    <button type="submit" className="comment-submit-btn" disabled={isCommenting}>
                        {isCommenting ? 'Enviando...' : 'Enviar Comentário'}
                    </button>
                </form>
            )}
          </section>
        </section>
        <Footer />
      </main>
  );
}