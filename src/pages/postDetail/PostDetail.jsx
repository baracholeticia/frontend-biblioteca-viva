import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { Pagination } from '../../components/pagination/Pagination'; // ajuste o caminho conforme a localização real do arquivo
import { getWorkById, likeWork, getLikedWorks, updateWork, deleteWork } from '../../services/workService';
import { getComments, createComment, getReplies, createReply, updateComment, deleteComment, likeComment, unlikeComment } from '../../services/commentService';
import { getBookClubById, getBookClubReviews, updateBookClub, deleteBookClub, getBookClubParticipants } from '../../services/bookclubService';
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

function getIsCurador() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return false;
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role || payload.roles || '';
        return role.includes('CURADOR') || role === 'ROLE_CURADOR';
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

const initialEditForm = {
    title: '', author: '', description: '', content: '', url: '',
    duration: '', genre: '', rhymeScheme: '', rate: 0,
    theme: '', themeDescription: '', feedback: ''
};

function convertToIsoDuration(t) {
    if (!t) return '';
    if (t.startsWith('PT')) return t;
    if (t.includes(':')) {
        const [m, s] = t.split(':');
        return `PT${parseInt(m || 0)}M${parseInt(s || 0)}S`;
    }
    return `PT${parseInt(t || 0)}M`;
}

const getSavedKey = () => {
    let email = localStorage.getItem('userEmail');
    if (!email) email = 'guest';
    return `savedPosts_${email}`;
};

function getSavedIds() {
    const stored = localStorage.getItem(getSavedKey());
    return stored ? JSON.parse(stored) : [];
}

function toggleSaved(postId) {
    const saved = getSavedIds();
    const updated = saved.includes(postId) ? saved.filter(i => i !== postId) : [...saved, postId];
    localStorage.setItem(getSavedKey(), JSON.stringify(updated));
    return updated.includes(postId);
}


function BookClubPresencaPanel({ participants}) {
    const [search, setSearch] = useState('');

    const allParticipants = useMemo(() => {
        console.log('[BookClub] participants recebido:', participants);

        if (Array.isArray(participants)) {
            return participants.map(s => ({
                name: s.name || s.fullName || s.full_name || s.username || s.email || String(s),
                isOrganizer: s.isOrganizer || s.organizer || false,
            }));
        }

        const list = [];

        const org =
            participants.organizer ||
            participants.organizerName ||
            participants.organizer_name;

        if (org) {
            if (typeof org === 'string') {
                list.push({ name: org, isOrganizer: true });
            } else if (typeof org === 'object') {
                list.push({
                    name: org.name || org.username || org.email || String(org),
                    isOrganizer: true,
                });
            }
        }

        const raw =
            participants.students ||
            participants.participants ||
            participants.members ||
            participants.users ||
            participants.alunos ||
            participants.content ||
            [];

        const arr = Array.isArray(raw) ? raw : Object.values(raw);

        arr.forEach(s => {
            if (!s) return;
            if (typeof s === 'string') {
                list.push({ name: s, isOrganizer: false });
            } else {
                list.push({
                    name: s.name || s.fullName || s.full_name || s.username || s.email || String(s),
                    isOrganizer: s.isOrganizer || false,
                });
            }
        });

        return list;
    }, [participants]);

    const filtered = useMemo(() => {
        if (!search.trim()) return allParticipants;
        const q = search.toLowerCase();
        return allParticipants.filter(p => p.name.toLowerCase().includes(q));
    }, [allParticipants, search]);

    return (
        <>
            <div className="bc-search-wrap">
                <span className="bc-search-icon" aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                </span>
                <input
                    className="bc-search-input"
                    type="text"
                    placeholder="Buscar aluno..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                />
            </div>

            <div className="bc-participants-table-wrap">
                {filtered.length > 0 ? (
                    <table className="bc-participants-table">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Aluno</th>
                            <th>Papel</th>
                        </tr>
                        </thead>
                        <tbody>
                        {filtered.map((p, idx) => (
                            <tr key={idx}>
                                <td>{idx + 1}</td>
                                <td className="bc-td-name">{p.name}</td>
                                <td>
                                    {p.isOrganizer
                                        ? <span className="bc-badge-organizer">Organizador</span>
                                        : <span className="bc-badge-confirmed">Inscrito</span>}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="bc-presence-empty">
                        {search ? 'Nenhum resultado encontrado.' : 'Nenhum participante inscrito ainda.'}
                    </div>
                )}
            </div>
        </>
    );
}


function resolveReplyBadge(reply, isBookClub, isAdmin, isCurador) {
    if (isBookClub) {
        return { label: 'AUTOR', className: 'reply-badge--admin', title: 'Organizador do clube' };
    }
    const replyIsAdmin = reply.isAdmin ?? isAdmin;
    const replyIsCurador = reply.isCurador ?? (isCurador && !isAdmin);
    if (replyIsAdmin) {
        return { label: 'ADMIN', className: 'reply-badge--admin', title: 'Administrador' };
    }
    if (replyIsCurador) {
        return { label: 'CURADOR', className: 'reply-badge--red', title: 'Curador' };
    }
    return { label: 'STAFF', className: 'reply-badge--admin', title: 'Staff' };
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
    const [isSaved, setIsSaved] = useState(() => getSavedIds().includes(id));
    const [participants, setParticipants] = useState({ organizer: '', students: [] });
    const [activeTab, setActiveTab] = useState('resenhas');

    const [reviewsPage, setReviewsPage] = useState(1);
    const [reviewsPerPage, setReviewsPerPage] = useState(10);
    const [commentsPage, setCommentsPage] = useState(1);
    const [commentsPerPage, setCommentsPerPage] = useState(10);

    const [isEditingBookClub, setIsEditingBookClub] = useState(false);
    const [bookClubEditForm, setBookClubEditForm] = useState({
        bookName: '', bookAuthor: '', bookSynopses: '', bookCoverUrl: '', date: '', location: ''
    });

    const isAdmin = useMemo(() => getIsAdmin(), []);
    const isCurador = useMemo(() => getIsCurador(), []);
    const currentUserName = useMemo(() => getCurrentUserName(), []);

    const [isEditing, setIsEditing] = useState(false);
    const [editForm, setEditForm] = useState(initialEditForm);
    const [isSaving, setIsSaving] = useState(false);

    const [replies, setReplies] = useState({});
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isSendingReply, setIsSendingReply] = useState(false);

    const [editingCommentId, setEditingCommentId] = useState(null);
    const [editingCommentText, setEditingCommentText] = useState('');
    const [isSavingComment, setIsSavingComment] = useState(false);

    const isBookClub = categoria === 'clube-leitura';

    const isOrganizerOfThisClub = useMemo(() => {
        if (!post || !isBookClub) return false;
        try {
            const token = localStorage.getItem('token');
            if (!token) return false;
            const payload = JSON.parse(atob(token.split('.')[1]));
            const tokenEmail = (payload.sub || payload.email || '').toLowerCase();
            const tokenName = (payload.name || payload.username || '').toLowerCase();
            const organizer = (post.organizerName || '').toLowerCase();
            const userEmail = (localStorage.getItem('userEmail') || '').toLowerCase();
            return (
                organizer === tokenName ||
                organizer === tokenEmail ||
                organizer === userEmail ||
                organizer === userEmail.split('@')[0]
            );
        } catch { return false; }
    }, [post, isBookClub]);

    useEffect(() => {
        setReviewsPage(1);
        setCommentsPage(1);
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
                    setComments(revs.content ? revs.content : []);
                    setLikes(bc.averageRating || 0);

                    if (isAdmin || isCurador) {
                        try {
                            const p = await getBookClubParticipants(id);
                            console.log('[BookClub] participantes brutos da API:', p);
                            setParticipants(p);
                        } catch (e) {
                            console.error('[BookClub] erro ao buscar participantes:', e);
                        }
                    }
                } else {
                    let commentsData;
                    try { commentsData = await getComments(id); } catch { commentsData = []; }

                    const postData = await getWorkById(id);
                    setPost(postData);
                    setComments(commentsData || []);

                    const likesMap = {};
                    (commentsData || []).forEach(c => { likesMap[c.id] = { count: c.likes || 0, liked: false }; });
                    setCommentLikes(likesMap);
                    setLikes(postData.likeCount || 0);
                    setEditForm({ ...initialEditForm, ...postData });

                    if (isLoggedIn()) {
                        let likedList = [];
                        try { likedList = await getLikedWorks(); } catch { likedList = []; }
                        setHasLiked(likedList.includes(id));
                    }

                    if (commentsData && commentsData.length > 0) {
                        const repliesMap = {};
                        await Promise.all(
                            commentsData.map(async c => {
                                let r = null;
                                try { r = await getReplies(id, c.id); } catch { r = null; }
                                if (r && !Array.isArray(r)) {

                                    repliesMap[c.id] = {
                                        ...r,
                                        isAdmin: isAdmin,
                                        isCurador: isCurador && !isAdmin,
                                    };
                                } else if (r) {
                                    repliesMap[c.id] = r;
                                }
                            })
                        );
                        setReplies(repliesMap);
                    }
                }
            } catch (err) {
                console.error('Erro ao buscar dados do post:', err);
                setError('Post não encontrado ou erro de conexão com o servidor.');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [id, isBookClub, isAdmin, isCurador]);

    const handleAdminDelete = async () => {
        if (!window.confirm('Tem certeza que deseja excluir este post?')) return;
        try {
            if (isBookClub) {
                await deleteBookClub(id);
                showToast('Clube excluído com sucesso.', 'success');
            } else {
                await deleteWork(id);
                showToast('Post excluído com sucesso.', 'success');
            }
            navigate(-1);
        } catch (err) {
            console.error(err);
            showToast('Erro ao excluir.', 'error');
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
            };
            if (editForm.content !== undefined) payload.content = editForm.content;
            if (editForm.url !== undefined) payload.url = editForm.url;
            if (editForm.genre !== undefined) payload.genre = editForm.genre;
            if (editForm.rhymeScheme !== undefined) payload.rhymeScheme = editForm.rhymeScheme;
            if (editForm.rate !== undefined) payload.rate = Number(editForm.rate);
            if (editForm.theme !== undefined) payload.theme = editForm.theme;
            if (editForm.themeDescription !== undefined) payload.themeDescription = editForm.themeDescription;
            if (editForm.feedback !== undefined) payload.feedback = editForm.feedback;
            if (['Multimedia', 'LibraLiterature'].includes(post.type) && editForm.duration) {
                payload.duration = convertToIsoDuration(editForm.duration);
            }
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

    const handleBookClubSave = async () => {
        setIsSaving(true);
        try {
            const payload = {
                bookName: bookClubEditForm.bookName,
                bookAuthor: bookClubEditForm.bookAuthor,
                bookSynopses: bookClubEditForm.bookSynopses,
                bookCoverUrl: bookClubEditForm.bookCoverUrl,
                date: bookClubEditForm.date ? new Date(bookClubEditForm.date).toISOString() : post.date,
                location: bookClubEditForm.location,
            };
            await updateBookClub(id, payload);
            setPost(prev => ({
                ...prev,
                ...payload,
                title: payload.bookName,
                author: payload.bookAuthor,
                description: payload.bookSynopses,
                url: payload.bookCoverUrl,
                publicationDate: payload.date,
            }));
            setIsEditingBookClub(false);
            showToast('Clube atualizado com sucesso!', 'success');
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
        if (isBookClub || isLiking) return;
        setIsLiking(true);
        try {
            await likeWork(id);
            if (hasLiked) { setLikes(l => l - 1); setHasLiked(false); }
            else { setLikes(l => l + 1); setHasLiked(true); }
        } catch (err) {
            console.error('Erro ao curtir:', err);
            showToast('Não foi possível registrar a curtida.', 'error');
        } finally {
            setIsLiking(false);
        }
    };

    const handleAddComment = async (e) => {
        e.preventDefault();
        if (!isLoggedIn()) { showToast('Faça login para comentar.', 'error'); navigate('/login'); return; }
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
            setCommentsPage(1);
        } catch (err) {
            console.error('Erro ao enviar comentário:', err);
            showToast('Erro ao enviar. Tente novamente.', 'error');
        } finally {
            setIsCommenting(false);
        }
    };

    const canReply = useMemo(() => {
        if (!post || !isLoggedIn()) return false;
        if (isAdmin || isCurador) return true;
        if (post.author) {
            const authorLower = post.author.toLowerCase();
            const userName = (localStorage.getItem('userName') || '').toLowerCase();
            const userEmail = localStorage.getItem('userEmail') || '';
            const emailPrefix = userEmail.split('@')[0].toLowerCase();
            if (userName && (authorLower.includes(userName) || userName.includes(authorLower))) return true;
            if (emailPrefix && authorLower.includes(emailPrefix)) return true;
        }
        return false;
    }, [post, isAdmin, isCurador]);

    const totalInteractions = useMemo(() => {
        let repliesCount = 0;
        Object.values(replies).forEach(r => { if (r) repliesCount += 1; });
        return comments.length + repliesCount;
    }, [comments, replies]);

    // --- Fatias paginadas de resenhas (clube do livro) e comentários (posts normais) ---
    const reviewsTotalPages = Math.max(1, Math.ceil(comments.length / reviewsPerPage));
    const paginatedReviews = useMemo(() => {
        const start = (reviewsPage - 1) * reviewsPerPage;
        return comments.slice(start, start + reviewsPerPage);
    }, [comments, reviewsPage, reviewsPerPage]);

    const commentsTotalPages = Math.max(1, Math.ceil(comments.length / commentsPerPage));
    const paginatedComments = useMemo(() => {
        const start = (commentsPage - 1) * commentsPerPage;
        return comments.slice(start, start + commentsPerPage);
    }, [comments, commentsPage, commentsPerPage]);

    const handleReviewsPerPageChange = (n) => { setReviewsPerPage(n); setReviewsPage(1); };
    const handleCommentsPerPageChange = (n) => { setCommentsPerPage(n); setCommentsPage(1); };

    const handleOpenReply = (commentId) => {
        if (!isLoggedIn()) { showToast('Faça login para responder.', 'error'); navigate('/login'); return; }
        setReplyingTo(replyingTo === commentId ? null : commentId);
        setReplyText('');
    };

    const handleSendReply = async (commentId) => {
        if (!replyText.trim()) return;
        setIsSendingReply(true);
        try {
            const newReply = await createReply(id, commentId, replyText.trim(), currentUserName, isAdmin || isCurador);
            setReplies(prev => ({
                ...prev,
                [commentId]: {
                    ...newReply,
                    isAdmin: isAdmin,
                    isCurador: isCurador && !isAdmin,
                }
            }));
            setReplyText('');
            setReplyingTo(null);
            showToast('Resposta enviada!', 'success');
        } catch (err) {
            if (err.response?.status === 409) {
                // Já existe uma resposta — busca ela do servidor e exibe
                try {
                    const existing = await getReplies(id, commentId);
                    if (existing) {
                        setReplies(prev => ({
                            ...prev,
                            [commentId]: {
                                ...existing,
                                isAdmin: isAdmin,
                                isCurador: isCurador && !isAdmin,
                            }
                        }));
                    }
                } catch {
                    // ignora
                }
                showToast('Esse comentário já possui uma resposta.', 'error');
            } else {
                showToast('Erro ao enviar resposta. Tente novamente.', 'error');
            }
            console.error('Erro ao enviar resposta:', err);
        } finally {
            setIsSendingReply(false);
            setReplyingTo(null);
            setReplyText('');
        }
    };

    const handleEditComment = (comment) => {
        setEditingCommentId(comment.id);
        setEditingCommentText(comment.content);
        setReplyingTo(null);
    };

    const handleSaveEditComment = async (commentId) => {
        if (!editingCommentText.trim()) return;
        setIsSavingComment(true);
        try {
            await updateComment(id, commentId, editingCommentText.trim());
            setComments(prev => prev.map(c => c.id === commentId ? { ...c, content: editingCommentText.trim() } : c));
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
        if (!isLoggedIn()) { showToast('Faça login para curtir.', 'error'); navigate('/login'); return; }
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
        return text.split(/\\n|\n/).map((line, index) => <span key={index}>{line}<br /></span>);
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        return new Date(isoDate).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    };

    if (loading || error || !post) return null;

    const translatedCategory = categoryTranslations[post.type] || post.type;
    const youtubeId = getYouTubeId(post.url);
    const canManagePost = (isAdmin || isCurador) && !isBookClub;
    const canManageBookClub = isBookClub && (isAdmin || (isCurador && isOrganizerOfThisClub));
    const showBookClubTabs = isBookClub && (isAdmin || isCurador);

    const totalParticipants = (() => {
        const org = participants.organizer || participants.organizerName || participants.organizer_name;
        const raw = participants.students || participants.participants || participants.members || participants.users || participants.alunos || [];
        const arr = Array.isArray(raw) ? raw : Object.values(raw);
        return arr.length + (org ? 1 : 0);
    })();

    const ShieldIcon = () => (
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" fill="currentColor" opacity="0.25" />
            <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.35C17.25 22.15 21 17.25 21 12V7L12 2z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
            <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
    );

    return (
        <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: '#f6f7f9' }}>
            <Header />
            <section className="post-container">
                <article className="post-content">
                    <button
                        onClick={() => navigate(-1)}
                        className="post-back"
                        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                    >
                        ← Voltar
                    </button>

                    {canManagePost && (
                        <div className="admin-post-toolbar">
                            <span className="admin-post-toolbar__label">
                                {isAdmin ? '⚙ Painel Admin' : '⚙ Painel Curador'}
                            </span>
                            <div className="admin-post-toolbar__actions">
                                <button className="action-btn btn-edit" onClick={() => setIsEditing(prev => !prev)}>
                                    <IconPencil size={14} /> {isEditing ? 'Cancelar' : 'Editar Post'}
                                </button>
                                <button className="action-btn btn-delete" onClick={handleAdminDelete}>
                                    <IconTrash size={14} /> Excluir Post
                                </button>
                            </div>
                        </div>
                    )}

                    {canManageBookClub && (
                        <div className="admin-post-toolbar">
                            <span className="admin-post-toolbar__label">
                                {isAdmin ? '⚙ Painel Admin' : '⚙ Painel Curador'}
                            </span>
                            <div className="admin-post-toolbar__actions">
                                <button
                                    className="action-btn btn-edit"
                                    onClick={() => {
                                        setBookClubEditForm({
                                            bookName: post.bookName || post.title || '',
                                            bookAuthor: post.bookAuthor || post.author || '',
                                            bookSynopses: post.bookSynopses || post.description || '',
                                            bookCoverUrl: post.bookCoverUrl || post.url || '',
                                            date: post.date ? post.date.slice(0, 16) : '',
                                            location: post.location || '',
                                        });
                                        setIsEditingBookClub(prev => !prev);
                                    }}
                                >
                                    <IconPencil size={14} /> {isEditingBookClub ? 'Cancelar' : 'Editar Clube'}
                                </button>
                                <button className="action-btn btn-delete" onClick={handleAdminDelete}>
                                    <IconTrash size={14} /> Excluir Clube
                                </button>
                            </div>
                        </div>
                    )}

                    {canManagePost && isEditing && (
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
                                <button className="reply-cancel-btn" onClick={() => setIsEditing(false)}>Cancelar</button>
                            </div>
                        </div>
                    )}

                    {canManageBookClub && isEditingBookClub && (
                        <div className="admin-edit-panel">
                            <h3 className="admin-edit-panel__title">Editar Clube de Leitura</h3>
                            <div className="admin-edit-grid">
                                <div className="admin-edit-field">
                                    <label>Nome do Livro</label>
                                    <input value={bookClubEditForm.bookName} onChange={e => setBookClubEditForm(f => ({ ...f, bookName: e.target.value }))} />
                                </div>
                                <div className="admin-edit-field">
                                    <label>Autor do Livro</label>
                                    <input value={bookClubEditForm.bookAuthor} onChange={e => setBookClubEditForm(f => ({ ...f, bookAuthor: e.target.value }))} />
                                </div>
                                <div className="admin-edit-field">
                                    <label>Data do Encontro</label>
                                    <input type="datetime-local" value={bookClubEditForm.date} onChange={e => setBookClubEditForm(f => ({ ...f, date: e.target.value }))} />
                                </div>
                                <div className="admin-edit-field">
                                    <label>Local</label>
                                    <input value={bookClubEditForm.location} onChange={e => setBookClubEditForm(f => ({ ...f, location: e.target.value }))} />
                                </div>
                                <div className="admin-edit-field admin-edit-field--full">
                                    <label>URL da Capa do Livro</label>
                                    <input value={bookClubEditForm.bookCoverUrl} onChange={e => setBookClubEditForm(f => ({ ...f, bookCoverUrl: e.target.value }))} />
                                    {bookClubEditForm.bookCoverUrl && (
                                        <img
                                            src={bookClubEditForm.bookCoverUrl}
                                            alt="Capa"
                                            style={{ marginTop: 8, height: 120, width: 80, objectFit: 'cover', borderRadius: 6 }}
                                            onError={e => e.target.style.display = 'none'}
                                        />
                                    )}
                                </div>
                                <div className="admin-edit-field admin-edit-field--full">
                                    <label>Sinopse</label>
                                    <textarea rows={5} value={bookClubEditForm.bookSynopses} onChange={e => setBookClubEditForm(f => ({ ...f, bookSynopses: e.target.value }))} />
                                </div>
                            </div>
                            <div className="admin-edit-panel__footer">
                                <button className="reply-submit-btn" onClick={handleBookClubSave} disabled={isSaving}>
                                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                                </button>
                                <button className="reply-cancel-btn" onClick={() => setIsEditingBookClub(false)}>Cancelar</button>
                            </div>
                        </div>
                    )}

                    <div className="post-header">
                        <span className="post-category">{translatedCategory}</span>
                        <h1 className="post-title">{post.title}</h1>

                        {isBookClub ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                                <span className="post-meta">
                                    Autor do livro:{' '}
                                    <strong>{post.author}</strong>
                                </span>
                                <span className="post-meta">
                                    Organizado por{' '}
                                    <span style={{ color: '#0a2a57', fontWeight: 600 }}>
                                        {post.organizerName || post.organizer || '—'}
                                    </span>{' '}
                                    em {formatDate(post.publicationDate)}
                                </span>
                            </div>
                        ) : (
                            <span className="post-meta">
                                Por{' '}
                                <Link to={`/autor/${encodeURIComponent(post.author)}`} className="post-author-link">
                                    {post.author}
                                </Link>{' '}
                                em {formatDate(post.publicationDate)}
                            </span>
                        )}
                    </div>

                    {youtubeId ? (
                        <div style={{ position: 'relative', paddingBottom: '56.25%', height: 0, overflow: 'hidden', marginBottom: 32, borderRadius: 12 }}>
                            <iframe
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', borderRadius: 12 }}
                                src={`https://www.youtube.com/embed/${youtubeId}`}
                                title="YouTube"
                                frameBorder="0"
                                allowFullScreen
                            />
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
                            <button
                                className={`like-btn ${hasLiked ? 'liked' : ''}`}
                                onClick={handleLike}
                                disabled={isLiking}
                                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                            >
                                <IconHeart size={20} color={hasLiked ? '#d62828' : '#6b778c'} filled={hasLiked} />
                                <span>{likes} <span className="interact-text">Curtidas</span></span>
                            </button>
                        )}
                        <span className="btn-interact" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <IconMessage size={20} />
                            <span>
                                {totalInteractions}{' '}
                                <span className="interact-text">
                                    {isBookClub ? 'Resenhas' : 'Comentários'}
                                </span>
                            </span>
                        </span>
                        <button
                            className={`save-btn ${isSaved ? 'save-btn--saved' : ''}`}
                            onClick={handleSave}
                            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                        >
                            <IconBookmark size={20} color={isSaved ? '#0a2a57' : '#6b778c'} />
                            <span className="interact-text">{isSaved ? 'Salvo' : 'Salvar'}</span>
                        </button>
                    </div>
                </article>

                {showBookClubTabs ? (
                    <div className="post-detail-bottom">
                        <section className="comments-section">
                            <div className="bc-tabs">
                                <button
                                    className={`bc-tab ${activeTab === 'resenhas' ? 'bc-tab--active' : ''}`}
                                    onClick={() => setActiveTab('resenhas')}
                                >
                                    Resenhas dos Leitores
                                    <span className="bc-tab__badge">{comments.length}</span>
                                </button>
                                <button
                                    className={`bc-tab ${activeTab === 'presencas' ? 'bc-tab--active' : ''}`}
                                    onClick={() => setActiveTab('presencas')}
                                >
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                        <circle cx="9" cy="7" r="4"/>
                                        <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                        <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                                    </svg>
                                    Presenças
                                    <span className="bc-tab__badge">{totalParticipants}</span>
                                </button>
                            </div>

                            {activeTab === 'resenhas' && (
                                <>
                                    {comments.length > 0 ? (
                                        <>
                                            <div className="comment-list">
                                                {paginatedReviews.map(comment => (
                                                    <div key={comment.id} className="comment-item">
                                                        <div className="comment-author">
                                                            <Link to={`/autor/${encodeURIComponent(comment.authorName)}`} className="post-author-link">
                                                                {comment.authorName}
                                                            </Link>
                                                            <span style={{ marginLeft: 8, color: '#f5a623' }}>★ {comment.rating}</span>
                                                            <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginLeft: '8px', fontWeight: 'normal' }}>
                                                                {formatDate(comment.createdAt)}
                                                            </span>
                                                        </div>
                                                        <div className="comment-text">{comment.content}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <Pagination
                                                currentPage={reviewsPage}
                                                totalPages={reviewsTotalPages}
                                                totalItems={comments.length}
                                                perPage={reviewsPerPage}
                                                onPageChange={setReviewsPage}
                                                onPerPageChange={handleReviewsPerPageChange}
                                            />
                                        </>
                                    ) : (
                                        <p style={{ color: '#6b778c', fontFamily: 'Poppins, system-ui, sans-serif' }}>
                                            Nenhuma resenha ainda.
                                        </p>
                                    )}
                                </>
                            )}

                            {activeTab === 'presencas' && (
                                <BookClubPresencaPanel participants={participants} formatDate={formatDate} />
                            )}
                        </section>
                    </div>

                ) : isBookClub ? (
                    <div className="post-detail-bottom">
                        <section className="comments-section">
                            <h2>Resenhas dos Leitores</h2>
                            {comments.length > 0 ? (
                                <>
                                    <div className="comment-list">
                                        {paginatedReviews.map(comment => (
                                            <div key={comment.id} className="comment-item">
                                                <div className="comment-author">
                                                    <Link to={`/autor/${encodeURIComponent(comment.authorName)}`} className="post-author-link">
                                                        {comment.authorName}
                                                    </Link>
                                                    <span style={{ marginLeft: 8, color: '#f5a623' }}>★ {comment.rating}</span>
                                                    <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginLeft: '8px', fontWeight: 'normal' }}>
                                                        {formatDate(comment.createdAt)}
                                                    </span>
                                                </div>
                                                <div className="comment-text">{comment.content}</div>
                                            </div>
                                        ))}
                                    </div>
                                    <Pagination
                                        currentPage={reviewsPage}
                                        totalPages={reviewsTotalPages}
                                        totalItems={comments.length}
                                        perPage={reviewsPerPage}
                                        onPageChange={setReviewsPage}
                                        onPerPageChange={handleReviewsPerPageChange}
                                    />
                                </>
                            ) : (
                                <p style={{ color: '#6b778c', fontFamily: 'Poppins, system-ui, sans-serif' }}>
                                    Nenhuma resenha ainda.
                                </p>
                            )}
                        </section>
                    </div>

                ) : (
                    <div className="post-detail-bottom">
                        <section className="comments-section">
                            <h2>Comentários</h2>
                            {comments.length > 0 ? (
                                    <div className="comment-list">
                                        {paginatedComments.map(comment => {
                                            const reply = replies[comment.id];
                                            const badge = reply && !Array.isArray(reply)
                                                ? resolveReplyBadge(reply, isBookClub, isAdmin, isCurador)
                                                : null;

                                            return (
                                                <div key={comment.id} className="comment-item">
                                                    <div className="comment-author">
                                                        <Link to={`/autor/${encodeURIComponent(comment.authorName)}`} className="post-author-link">
                                                            {comment.authorName}
                                                        </Link>
                                                        <span style={{ color: '#94a3b8', fontSize: '0.8rem', marginLeft: '8px', fontWeight: 'normal' }}>
                                                            {formatDate(comment.createdAt)}
                                                        </span>
                                                        {(isAdmin || isCurador) && (
                                                            <span className="comment-admin-actions">
                                                                <button
                                                                    className="action-btn btn-edit"
                                                                    title="Editar comentário"
                                                                    onClick={() => {
                                                                        if (editingCommentId === comment.id) {
                                                                            setEditingCommentId(null);
                                                                            setEditingCommentText('');
                                                                        } else {
                                                                            handleEditComment(comment);
                                                                        }
                                                                    }}
                                                                >
                                                                    <IconPencil size={13} />
                                                                    {editingCommentId === comment.id ? 'Cancelar' : 'Editar'}
                                                                </button>
                                                                <button
                                                                    className="action-btn btn-delete"
                                                                    title="Excluir comentário"
                                                                    onClick={() => handleDeleteComment(comment.id)}
                                                                >
                                                                    <IconTrash size={13} /> Excluir
                                                                </button>
                                                            </span>
                                                        )}
                                                    </div>

                                                    {editingCommentId === comment.id ? (
                                                        <div className="comment-edit-form">
                                                            <textarea
                                                                className="comment-edit-textarea"
                                                                value={editingCommentText}
                                                                onChange={e => setEditingCommentText(e.target.value)}
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
                                                            <button
                                                                className={`like-btn like-btn--comment ${commentLikes[comment.id]?.liked ? 'liked' : ''}`}
                                                                onClick={() => handleLikeComment(comment.id)}
                                                                style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 6, fontSize: 13 }}
                                                            >
                                                                <IconHeart size={14} color={commentLikes[comment.id]?.liked ? '#d62828' : '#6b778c'} filled={commentLikes[comment.id]?.liked} />
                                                                <span>{commentLikes[comment.id]?.count || 0}</span>
                                                            </button>
                                                        </>
                                                    )}

                                                    {reply && !Array.isArray(reply) && badge && (
                                                        <div className="reply-list">
                                                            <div className="reply-item">
                                                                <div className="reply-author">
                                                                    <span className={`reply-badge ${badge.className}`} title={badge.title}>
    <ShieldIcon />
    <span className="reply-badge__role">{badge.label}</span>
</span>
                                                                    <span className="reply-date">{formatDate(reply.createdAt)}</span>
                                                                </div>
                                                                <div className="reply-text">{reply.content}</div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {canReply && (
                                                        <div className="reply-action-area">
                                                            {replyingTo === comment.id ? (
                                                                <div className="reply-form">
                                                                    <textarea
                                                                        className="reply-textarea"
                                                                        placeholder="Escreva sua resposta..."
                                                                        value={replyText}
                                                                        onChange={e => setReplyText(e.target.value)}
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
                                                                <button className="reply-btn" onClick={() => handleOpenReply(comment.id)}>
                                                                    ↩ Responder
                                                                </button>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                            ) : (
                                <p style={{ color: '#6b778c', marginBottom: 24, fontFamily: 'Poppins, system-ui, sans-serif' }}>
                                    Seja o primeiro a interagir!
                                </p>
                            )}

                            <form className="comment-form" onSubmit={handleAddComment}>
                                <textarea
                                    placeholder="Escreva um comentário..."
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    disabled={isCommenting}
                                />
                                <button type="submit" className="comment-submit-btn" disabled={isCommenting}>
                                    {isCommenting ? 'Enviando...' : 'Enviar Comentário'}
                                </button>
                            </form>

                                    {comments.length > 0 && (
                                        <div style={{ marginTop: 24 }}>
                                            <Pagination
                                                currentPage={commentsPage}
                                                totalPages={commentsTotalPages}
                                                totalItems={comments.length}
                                                perPage={commentsPerPage}
                                                onPageChange={setCommentsPage}
                                                onPerPageChange={handleCommentsPerPageChange}
                                            />
                                        </div>
                                    )}
                        </section>
                    </div>
                )}
            </section>
            <Footer />
        </main>
    );
}