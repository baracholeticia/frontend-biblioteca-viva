import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { getWorkById, likeWork, getLikedWorks, updateWork, deleteWork } from '../../services/workService';
import { getComments, createComment, getReplies, createReply, updateComment, deleteComment, likeComment, unlikeComment } from '../../services/commentService';
import { getBookClubById, getBookClubReviews } from '../../services/bookclubService';
import { isLoggedIn } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import { IconHeart, IconMessage, IconBookmark, IconPencil, IconTrash } from '../../components/icons';
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

const typeEndpoints = {
  'Essay': 'essays', 'Cordel': 'cordels', 'Tale': 'tales', 'ShortStory': 'short-stories',
  'Article': 'articles', 'Infographic': 'infographics', 'Art': 'arts',
  'Multimedia': 'multimedias', 'LibraLiterature': 'libra-literatures', 'Poem': 'poems'
};

function getIsAdmin() {
  try {
    const token = localStorage.getItem('token');
    if (!token) return false;
    const payload = JSON.parse(atob(token.split('.')[1]));
    const role = payload.role || payload.roles || '';
    return role.includes('ADMIN') || role === 'ROLE_ADMIN';
  } catch { return false; }
}

function getCurrentUserName() {
  const name = localStorage.getItem('userName');
  if (name) return name;
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.name || payload.username || null;
  } catch { return null; }
}

const initialEditForm = { title: '', author: '', description: '', content: '', url: '', duration: '', genre: '', rhymeScheme: '', rate: 0, theme: '', themeDescription: '', feedback: '' };

function convertToIsoDuration(t) {
  if (!t) return '';
  if (t.startsWith('PT')) return t;
  if (t.includes(':')) { const [m, s] = t.split(':'); return `PT${parseInt(m||0)}M${parseInt(s||0)}S`; }
  return `PT${parseInt(t||0)}M`;
}

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
  const [commentLikes, setCommentLikes] = useState({});
  const [hasLiked, setHasLiked] = useState(false);
  const [isLiking, setIsLiking] = useState(false);
  const [isCommenting, setIsCommenting] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const isAdmin = useMemo(() => getIsAdmin(), []);
  const currentUserName = useMemo(() => getCurrentUserName(), []);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(initialEditForm);
  const [isSaving, setIsSaving] = useState(false);

  const [replies, setReplies] = useState({}); // { [commentId]: Reply[] }
  const [replyingTo, setReplyingTo] = useState(null); // commentId sendo respondido
  const [replyText, setReplyText] = useState('');
  const [isSendingReply, setIsSendingReply] = useState(false);

  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editingCommentText, setEditingCommentText] = useState('');
  const [isSavingComment, setIsSavingComment] = useState(false);

  const isBookClub = categoria === 'clube-leitura';

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

          const likesMap = {};
          (commentsData || []).forEach(c => {
            likesMap[c.id] = { count: c.likes || 0, liked: false };
          });
          setCommentLikes(likesMap);

          setLikes(postData.likeCount || 0);
          setEditForm({ ...initialEditForm, ...postData });

          if (isLoggedIn()) {
            const likedList = await getLikedWorks().catch(() => []);
            setHasLiked(likedList.includes(id));
          }

          if (commentsData && commentsData.length > 0) {
            const repliesMap = {};
            await Promise.all(
                commentsData.map(async (c) => {
                  const r = await getReplies(id, c.id).catch(() => []);
                  if (r && r.length > 0) repliesMap[c.id] = r;
                })
            );
            setReplies(repliesMap);
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

  const handleAdminDelete = async () => {
    if (!window.confirm('Tem certeza que deseja excluir este post?')) return;
    try {
      await deleteWork(id);
      showToast('Post excluído com sucesso.', 'success');
      navigate(-1);
    } catch (err) {
      console.error(err);
      showToast('Erro ao excluir o post.', 'error');
    }
  };

  const handleAdminSave = async () => {
    setIsSaving(true);
    try {
      const endpointType = typeEndpoints[post.type];
      const payload = {
        title: editForm.title,
        author: editForm.author,
        description: editForm.description,
        publicationDate: post.publicationDate,
        ...(editForm.content !== undefined && { content: editForm.content }),
        ...(editForm.url !== undefined && { url: editForm.url }),
        ...(editForm.genre !== undefined && { genre: editForm.genre }),
        ...(editForm.rhymeScheme !== undefined && { rhymeScheme: editForm.rhymeScheme }),
        ...(editForm.rate !== undefined && { rate: Number(editForm.rate) }),
        ...(editForm.theme !== undefined && { theme: editForm.theme }),
        ...(editForm.themeDescription !== undefined && { themeDescription: editForm.themeDescription }),
        ...(editForm.feedback !== undefined && { feedback: editForm.feedback }),
        ...(['Multimedia', 'LibraLiterature'].includes(post.type) && editForm.duration
            ? { duration: convertToIsoDuration(editForm.duration) } : {}),
      };
      await updateWork(endpointType, id, payload);
      setPost(prev => ({ ...prev, ...editForm }));
      setIsEditing(false);
      showToast('Post atualizado com sucesso!', 'success');
    } catch (err) {
      console.error(err);
      showToast('Erro ao salvar alterações.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

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

  const canReply = useMemo(() => {
    if (!post || !isLoggedIn()) return false;
    if (isAdmin) return true;
    if (post.author) {
      const authorLower = post.author.toLowerCase();
      const userName = (localStorage.getItem('userName') || '').toLowerCase();
      const userEmail = localStorage.getItem('userEmail') || '';
      const emailPrefix = userEmail.split('@')[0].toLowerCase();
      if (userName && (authorLower.includes(userName) || userName.includes(authorLower))) return true;
      if (emailPrefix && authorLower.includes(emailPrefix)) return true;
    }
    return false;
  }, [post, isAdmin]);

  const totalInteractions = useMemo(() => {
    const repliesCount = Object.values(replies).reduce((acc, r) => acc + r.length, 0);
    return comments.length + repliesCount;
  }, [comments, replies]);

  const handleOpenReply = (commentId) => {
    if (!isLoggedIn()) {
      showToast('Faça login para responder.', 'error');
      navigate('/login');
      return;
    }
    setReplyingTo(replyingTo === commentId ? null : commentId);
    setReplyText('');
  };

  const handleSendReply = async (commentId) => {
    if (!replyText.trim()) return;
    setIsSendingReply(true);
    try {
      const newReply = await createReply(id, commentId, replyText.trim(), currentUserName, isAdmin);
      setReplies(prev => ({
        ...prev,
        [commentId]: [...(prev[commentId] || []), newReply],
      }));
      setReplyText('');
      setReplyingTo(null);
      showToast('Resposta enviada!', 'success');
    } catch (err) {
      console.error('Erro ao enviar resposta:', err);
      showToast('Erro ao enviar resposta. Tente novamente.', 'error');
    } finally {
      setIsSendingReply(false);
    }
  };

  const handleEditComment = (comment) => {
    setEditingCommentId(comment.id);
    setEditingCommentText(comment.content);
    setReplyingTo(null); // fecha qualquer reply aberta
  };

  const handleSaveEditComment = async (commentId) => {
    if (!editingCommentText.trim()) return;
    setIsSavingComment(true);
    try {
      await updateComment(id, commentId, editingCommentText.trim());
      setComments(prev => prev.map(c =>
          c.id === commentId ? { ...c, content: editingCommentText.trim() } : c
      ));
      setEditingCommentId(null);
      setEditingCommentText('');
      showToast('Comentário atualizado!', 'success');
    } catch (err) {
      console.error('Erro ao editar comentário:', err);
      showToast('Erro ao editar comentário.', 'error');
    } finally {
      setIsSavingComment(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Tem certeza que deseja excluir este comentário?')) return;
    try {
      await deleteComment(id, commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      setReplies(prev => { const next = { ...prev }; delete next[commentId]; return next; });
      showToast('Comentário excluído.', 'success');
    } catch (err) {
      console.error('Erro ao excluir comentário:', err);
      showToast('Erro ao excluir comentário.', 'error');
    }
  };

  const handleLikeComment = async (commentId) => {
    if (!isLoggedIn()) {
      showToast('Faça login para curtir.', 'error');
      navigate('/login');
      return;
    }
    const current = commentLikes[commentId] || { count: 0, liked: false };
    try {
      if (current.liked) {
        await unlikeComment(id, commentId);
        setCommentLikes(prev => ({ ...prev, [commentId]: { count: prev[commentId].count - 1, liked: false } }));
      } else {
        await likeComment(id, commentId);
        setCommentLikes(prev => ({ ...prev, [commentId]: { count: prev[commentId].count + 1, liked: true } }));
      }
    } catch (err) {
      console.error('Erro ao curtir comentário:', err);
      showToast('Erro ao curtir comentário.', 'error');
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

            {isAdmin && !isBookClub && (
                <div className="admin-post-toolbar">
                  <span className="admin-post-toolbar__label">⚙ Painel Admin</span>
                  <div className="admin-post-toolbar__actions">
                    <button
                        className="action-btn btn-edit"
                        onClick={() => setIsEditing(prev => !prev)}
                    >
                      <IconPencil size={14} /> {isEditing ? 'Cancelar' : 'Editar Post'}
                    </button>
                    <button className="action-btn btn-delete" onClick={handleAdminDelete}>
                      <IconTrash size={14} /> Excluir Post
                    </button>
                  </div>
                </div>
            )}

            {isAdmin && isEditing && !isBookClub && (
                <div className="admin-edit-panel">
                  <h3 className="admin-edit-panel__title">Editar Post</h3>
                  <div className="admin-edit-grid">
                    <div className="admin-edit-field">
                      <label>Título</label>
                      <input value={editForm.title} onChange={e => setEditForm(f => ({ ...f, title: e.target.value }))} />
                    </div>
                    <div className="admin-edit-field">
                      <label>Autor</label>
                      <input value={editForm.author} onChange={e => setEditForm(f => ({ ...f, author: e.target.value }))} />
                    </div>
                    <div className="admin-edit-field admin-edit-field--full">
                      <label>Descrição</label>
                      <input value={editForm.description} onChange={e => setEditForm(f => ({ ...f, description: e.target.value }))} />
                    </div>
                    {['Essay', 'Cordel', 'Tale', 'ShortStory', 'Article', 'Poem'].includes(post.type) && (
                        <div className="admin-edit-field admin-edit-field--full">
                          <label>Conteúdo</label>
                          <textarea rows={10} value={editForm.content} onChange={e => setEditForm(f => ({ ...f, content: e.target.value }))} />
                        </div>
                    )}
                    {['Art', 'Infographic', 'Multimedia', 'LibraLiterature'].includes(post.type) && (
                        <div className="admin-edit-field admin-edit-field--full">
                          <label>URL (Imagem/YouTube)</label>
                          <input value={editForm.url} onChange={e => setEditForm(f => ({ ...f, url: e.target.value }))} />
                        </div>
                    )}
                    {post.type === 'Essay' && (
                        <>
                          <div className="admin-edit-field">
                            <label>Nota</label>
                            <input type="number" value={editForm.rate} onChange={e => setEditForm(f => ({ ...f, rate: e.target.value }))} />
                          </div>
                          <div className="admin-edit-field">
                            <label>Tema</label>
                            <input value={editForm.theme} onChange={e => setEditForm(f => ({ ...f, theme: e.target.value }))} />
                          </div>
                          <div className="admin-edit-field admin-edit-field--full">
                            <label>Feedback</label>
                            <textarea rows={3} value={editForm.feedback} onChange={e => setEditForm(f => ({ ...f, feedback: e.target.value }))} />
                          </div>
                        </>
                    )}
                    {post.type === 'Cordel' && (
                        <div className="admin-edit-field">
                          <label>Esquema de Rimas</label>
                          <input value={editForm.rhymeScheme} onChange={e => setEditForm(f => ({ ...f, rhymeScheme: e.target.value }))} />
                        </div>
                    )}
                    {post.type === 'Tale' && (
                        <div className="admin-edit-field">
                          <label>Gênero</label>
                          <input value={editForm.genre} onChange={e => setEditForm(f => ({ ...f, genre: e.target.value }))} />
                        </div>
                    )}
                  </div>
                  <div className="admin-edit-panel__footer">
                    <button className="reply-submit-btn" onClick={handleAdminSave} disabled={isSaving}>
                      {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                    <button className="reply-cancel-btn" onClick={() => setIsEditing(false)}>
                      Cancelar
                    </button>
                  </div>
                </div>
            )}

            <div className="post-header">
              <span className="post-category">{translatedCategory}</span>
              <h1 className="post-title">{post.title}</h1>
              <span className="post-meta">Por <Link to={`/autor/${encodeURIComponent(post.author)}`} className="post-author-link">{post.author}</Link> em {formatDate(post.publicationDate)}</span>
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
                <span>{totalInteractions} <span className="interact-text">Comentários {isBookClub && "(Resenhas)"}</span></span>
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
                          <Link to={`/autor/${encodeURIComponent(comment.authorName)}`} className="post-author-link">{comment.authorName}</Link>
                          {isBookClub && <span style={{marginLeft: 8, color: '#f5a623'}}>★ {comment.rating}</span>}
                          <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginLeft: '8px', fontWeight: 'normal' }}>
                            {formatDate(comment.createdAt)}
                          </span>
                          {/* Ações de admin no comentário */}
                          {isAdmin && !isBookClub && (
                              <span className="comment-admin-actions">
                              <button
                                  className="action-btn btn-edit"
                                  title="Editar comentário"
                                  onClick={() => editingCommentId === comment.id
                                      ? (setEditingCommentId(null), setEditingCommentText(''))
                                      : handleEditComment(comment)
                                  }
                              >
                                <IconPencil size={13} />
                                {editingCommentId === comment.id ? 'Cancelar' : 'Editar'}
                              </button>
                              <button
                                  className="action-btn btn-delete"
                                  title="Excluir comentário"
                                  onClick={() => handleDeleteComment(comment.id)}
                              >
                                <IconTrash size={13} />
                                Excluir
                              </button>
                            </span>
                          )}
                        </div>

                        {/* Modo edição inline */}
                        {editingCommentId === comment.id ? (
                            <div className="comment-edit-form">
                            <textarea
                                className="comment-edit-textarea"
                                value={editingCommentText}
                                onChange={(e) => setEditingCommentText(e.target.value)}
                                disabled={isSavingComment}
                                rows={3}
                            />
                              <div className="comment-edit-actions">
                                <button
                                    className="reply-cancel-btn"
                                    onClick={() => { setEditingCommentId(null); setEditingCommentText(''); }}
                                    disabled={isSavingComment}
                                >
                                  Cancelar
                                </button>
                                <button
                                    className="reply-submit-btn"
                                    onClick={() => handleSaveEditComment(comment.id)}
                                    disabled={isSavingComment || !editingCommentText.trim()}
                                >
                                  {isSavingComment ? 'Salvando...' : 'Salvar'}
                                </button>
                              </div>
                            </div>
                        ) : (
                            <>
                              <div className="comment-text">{comment.content}</div>
                              {!isBookClub && (
                                  <button
                                      className={`like-btn like-btn--comment ${commentLikes[comment.id]?.liked ? 'liked' : ''}`}
                                      onClick={() => handleLikeComment(comment.id)}
                                      style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 13 }}
                                  >
                                    <IconHeart size={14} color={commentLikes[comment.id]?.liked ? '#d62828' : '#6b778c'} filled={commentLikes[comment.id]?.liked} />
                                    <span>{commentLikes[comment.id]?.count || 0}</span>
                                  </button>
                              )}
                            </>                        )}

                        {replies[comment.id] && replies[comment.id].length > 0 && (
                            <div className="reply-list">
                              {replies[comment.id].map((reply) => (
                                  <div key={reply.id} className="reply-item">
                                    <div className="reply-author">
                                      {reply.isAdmin ? (
                                          <span className="reply-badge reply-badge--admin" title="Administrador">
                                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill="currentColor" opacity="0.25"/>
                                            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                                            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          Admin
                                        </span>
                                      ) : (
                                          <span className="reply-badge reply-badge--autor" title="Autor do post">
                                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12z" fill="currentColor" opacity="0.3"/>
                                            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12z" stroke="currentColor" strokeWidth="1.8"/>
                                            <path d="M3.6 21.6c0-4.64 3.76-8.4 8.4-8.4s8.4 3.76 8.4 8.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                                            <path d="M15.5 17l1.2 1.2L19 15.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
                                          </svg>
                                          Autor
                                        </span>
                                      )}
                                      <span className="reply-author-name">{reply.authorName}</span>
                                      <span className="reply-date">{formatDate(reply.createdAt)}</span>
                                    </div>
                                    <div className="reply-text">{reply.content}</div>
                                  </div>
                              ))}
                            </div>
                        )}

                        {/* Botão responder (só para autor do post e admins) */}
                        {!isBookClub && canReply && (
                            <div className="reply-action-area">
                              {replyingTo === comment.id ? (
                                  <div className="reply-form">
                                    <textarea
                                        className="reply-textarea"
                                        placeholder="Escreva sua resposta..."
                                        value={replyText}
                                        onChange={(e) => setReplyText(e.target.value)}
                                        disabled={isSendingReply}
                                        rows={3}
                                    />
                                    <div className="reply-form-actions">
                                      <button
                                          className="reply-cancel-btn"
                                          onClick={() => { setReplyingTo(null); setReplyText(''); }}
                                          disabled={isSendingReply}
                                      >
                                        Cancelar
                                      </button>
                                      <button
                                          className="reply-submit-btn"
                                          onClick={() => handleSendReply(comment.id)}
                                          disabled={isSendingReply || !replyText.trim()}
                                      >
                                        {isSendingReply ? 'Enviando...' : 'Responder'}
                                      </button>
                                    </div>
                                  </div>
                              ) : (
                                  <button
                                      className="reply-btn"
                                      onClick={() => handleOpenReply(comment.id)}
                                  >
                                    ↩ Responder
                                  </button>
                              )}
                            </div>
                        )}
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