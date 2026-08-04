import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { getAllAdminComments } from '../../services/adminService';
import { 
  updateComment, 
  deleteComment, 
  getReplies, 
  updateReply, 
  deleteReply 
} from '../../services/commentService';
import { useToast } from '../../context/ToastContext';
import { IconPencil, IconTrash, IconSearch, IconCheck, IconClose, IconEye } from '../../components/icons';
import { Pagination } from '../../components/pagination/Pagination';
import './AdminLayout.css';

const ChevronIcon = ({ expanded }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export function AdminComments() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  
  const [replies, setReplies] = useState({});
  const [loadingReplies, setLoadingReplies] = useState({});
  const [editingReplyId, setEditingReplyId] = useState(null);
  const [editReplyText, setEditReplyText] = useState('');

  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);

  const fetchAllComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllAdminComments(0, 100);
      
      let commentsArray = [];
      if (data.content) {
          commentsArray = data.content;
      } else if (Array.isArray(data)) {
          commentsArray = data;
      }


      setAllComments(commentsArray);
    } catch (error) {
      console.error(error);
      showToast("Erro ao carregar comentários.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { 
    fetchAllComments(); 
  }, [fetchAllComments]);

  const startEdit = (comment) => { 
    setEditingId(comment.id); 
    setEditText(comment.content); 
  };

  const saveEdit = async (comment) => {
    try {
      await updateComment(comment.workId, comment.id, editText);
      showToast("Comentário atualizado!", "success");
      setEditingId(null);
      fetchAllComments();
    } catch (error) {
      console.error(error);
      showToast("Erro ao atualizar comentário.", "error");
    }
  };

  const handleDelete = async (comment) => {
    if (window.confirm('Excluir este comentário permanentemente?')) {
      try {
        await deleteComment(comment.workId, comment.id);
        showToast("Comentário excluído.", "success");
        fetchAllComments();
      } catch (error) {
        console.error(error);
        showToast("Erro ao excluir comentário.", "error");
      }
    }
  };

  const loadRepliesForComment = async (workId, commentId) => {
    try {
      setLoadingReplies(prev => ({ ...prev, [commentId]: true }));
      const repliesData = await getReplies(workId, commentId);
      setReplies(prev => ({ ...prev, [commentId]: repliesData }));
    } catch (error) {
      console.error(error);
      showToast("Erro ao carregar respostas.", "error");
    } finally {
      setLoadingReplies(prev => ({ ...prev, [commentId]: false }));
    }
  };

  const toggleExpand = (comment) => {
    let isExpanding = false;
    if (expandedId !== comment.id) {
        isExpanding = true;
    }

    if (isExpanding) {
        setExpandedId(comment.id);
        if (!replies[comment.id]) {
            loadRepliesForComment(comment.workId, comment.id);
        }
    } else {
        setExpandedId(null);
    }
  };

  const startEditReply = (reply) => {
    setEditingReplyId(reply.id);
    setEditReplyText(reply.content);
  };

  const saveEditReply = async (workId, commentId, replyId) => {
    try {
      await updateReply(workId, commentId, replyId, editReplyText);
      showToast("Resposta atualizada!", "success");
      setEditingReplyId(null);
      loadRepliesForComment(workId, commentId);
    } catch (error) {
      console.error(error);
      showToast("Erro ao atualizar resposta.", "error");
    }
  };

  const handleDeleteReply = async (workId, commentId, replyId) => {
    if (window.confirm('Excluir esta resposta permanentemente?')) {
      try {
        await deleteReply(workId, commentId, replyId);
        showToast("Resposta excluída.", "success");
        loadRepliesForComment(workId, commentId);
      } catch (error) {
        console.error(error);
        showToast("Erro ao excluir resposta.", "error");
      }
    }
  };

  let filtered = allComments.filter(c =>
      c.content?.toLowerCase().includes(search.toLowerCase()) ||
      c.userName?.toLowerCase().includes(search.toLowerCase()) ||
      c.workTitle?.toLowerCase().includes(search.toLowerCase())
  );

  filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    if (sortOrder === 'newest') {
        return dateB - dateA;
    } else {
        return dateA - dateB;
    }
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePerPageChange = (value) => { setPerPage(value); setCurrentPage(1); };

  const inputStyle = { padding: '10px 14px', border: '1px solid #dfe1e6', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#0a2a57', width: '100%', boxSizing: 'border-box' };

  function renderTableBody() {
      if (loading) {
          return <tr><td colSpan="4" style={{textAlign:'center', padding: '20px'}}>Carregando...</td></tr>;
      } else if (filtered.length === 0) {
          return <tr><td colSpan="4" style={{textAlign:'center', padding: '20px'}}>Nenhum comentário encontrado.</td></tr>;
      } else {
          return paginated.map(comment => renderCommentRow(comment));
      }
  }

  function renderReplySection(comment) {
      if (loadingReplies[comment.id]) {
          return <p style={{ fontSize: 13, color: '#6b778c' }}>Carregando resposta...</p>;
      } else if (!replies[comment.id]) {
          return <p style={{ fontSize: 13, color: '#6b778c' }}>Sem resposta.</p>;
      } else {
          const reply = replies[comment.id];
          return (
              <div style={{ padding: '10px', background: '#fff', border: '1px solid #dfe1e6', borderRadius: '6px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong style={{ fontSize: 13, color: '#0a2a57' }}>{reply.authorName || 'Autor'}</strong>
                    <span style={{ fontSize: 11, color: '#94a3b8' }}>
                      {reply.createdAt ? new Date(reply.createdAt).toLocaleDateString('pt-BR') : ''}
                    </span>
                  </div>
                  
                  {editingReplyId === reply.id ? (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
                      <input style={{ ...inputStyle, padding: '6px 10px' }} value={editReplyText} onChange={e => setEditReplyText(e.target.value)} autoFocus />
                      <button className="action-btn btn-approve" onClick={() => saveEditReply(comment.workId, comment.id, reply.id)} style={{ padding: 4 }}><IconCheck size={14} /></button>
                      <button className="action-btn btn-view" onClick={() => setEditingReplyId(null)} style={{ padding: 4 }}><IconClose size={14} /></button>
                    </div>
                  ) : (
                    <>
                      <p style={{ fontSize: 13, color: '#42526e', margin: '0 0 8px 0' }}>{reply.content}</p>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="action-btn btn-edit" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => startEditReply(reply)}>
                          <IconPencil size={12} /> Editar
                        </button>
                        <button className="action-btn btn-delete" style={{ padding: '4px 8px', fontSize: 12 }} onClick={() => handleDeleteReply(comment.workId, comment.id, reply.id)}>
                          <IconTrash size={12} /> Excluir
                        </button>
                      </div>
                    </>
                  )}
              </div>
          );
      }
  }

  function renderCommentRow(comment) {
      return (
          <tr key={comment.id}>
            <td>
              <div className="row-header" onClick={() => toggleExpand(comment)} style={{ cursor: 'pointer' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong style={{ color: '#0a2a57' }}>{comment.userName}</strong>                  {editingId === comment.id ? (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }} onClick={e => e.stopPropagation()}>
                      <input style={{ ...inputStyle, flex: 1 }} value={editText} onChange={e => setEditText(e.target.value)} autoFocus />
                      <button className="action-btn btn-approve" onClick={() => saveEdit(comment)} style={{ padding: 6 }}><IconCheck size={16} /></button>
                      <button className="action-btn btn-view" onClick={() => setEditingId(null)} style={{ padding: 6 }}><IconClose size={16} /></button>
                    </div>
                  ) : (
                    <p
                      className="comment-clamp"
                      style={{
                        color: '#42526e',
                        fontSize: 14,
                        marginTop: 4,
                        WebkitLineClamp: expandedId === comment.id ? 'unset' : 2,
                        lineClamp: expandedId === comment.id ? 'unset' : 2,
                        display: '-webkit-box',
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}
                    >
                      {comment.content}
                    </p>
                  )}
                </div>
                <button className="mobile-expand-btn"><ChevronIcon expanded={expandedId === comment.id} /></button>
              </div>

              {expandedId === comment.id && (
                <div className="mobile-expanded-content" style={{ marginTop: '16px', borderTop: '1px solid #eee', paddingTop: '12px' }}>
                  <p style={{ fontSize: 13, color: '#6b778c' }}><strong>Post:</strong> {comment.workTitle || 'Não especificado'}</p>
                  
                  <div className="admin-table-actions mobile-only-actions" style={{ marginTop: 12, marginBottom: 16 }}>
                    <button className="action-btn btn-view" onClick={() => navigate(`/post/${comment.workId}`)}><IconEye size={14} /> <span className="action-text">Ver Post</span></button>
                    <button className="action-btn btn-edit" onClick={() => startEdit(comment)}><IconPencil size={14} /> <span className="action-text">Editar</span></button>
                    <button className="action-btn btn-delete" onClick={() => handleDelete(comment)}><IconTrash size={14} /> <span className="action-text">Excluir</span></button>
                  </div>

                  <div style={{ marginTop: '16px', background: '#f9fafb', padding: '12px', borderRadius: '8px' }}>
                    <h4 style={{ fontSize: '13px', textTransform: 'uppercase', color: '#6b778c', marginBottom: '12px' }}>Resposta Oficial</h4>
                    {renderReplySection(comment)}
                  </div>
                </div>
              )}
            </td>

            <td className="desktop-cell" style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{comment.userName}</td>           <td className="desktop-cell" style={{ fontSize: 13, color: '#6b778c', maxWidth: 180 }}>
  <span
      className="truncate-text"
      style={{ maxWidth: 180 }}
      title={comment.workTitle || 'Não especificado'}
  >
    {comment.workTitle || 'Não especificado'}
  </span>
          </td>      <td className="desktop-cell">
              <div className="admin-table-actions">
                <button className="action-btn btn-view" title="Ver Post" onClick={() => navigate(`/post/${comment.workId}`)}><IconEye size={14} /></button>
                <button className="action-btn btn-edit" title="Editar Comentário" onClick={() => startEdit(comment)}><IconPencil size={14} /></button>
                <button className="action-btn btn-delete" title="Excluir Comentário" onClick={() => handleDelete(comment)}><IconTrash size={14} /></button>
              </div>
            </td>
          </tr>
      );
  }

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Comentários e Respostas</h1>
      <p className="admin-page-subtitle">{allComments.length} comentários no total</p>

      <div className="admin-card">
        <div className="admin-controls-bar">
          <div className="admin-search-input">
            <IconSearch size={18} color="#6b778c" />
            <input
              style={{ border: 'none', padding: '10px 0', fontSize: 14, width: '100%', outline: 'none' }}
              placeholder="Buscar por texto, autor ou post..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="admin-select" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="newest">Mais Recentes</option>
            <option value="oldest">Mais Antigos</option>
          </select>
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Comentário</th>
              <th className="desktop-cell">Autor</th>
              <th className="desktop-cell">Post Origem</th>
              <th className="desktop-cell">Ações</th>
            </tr>
          </thead>
          <tbody>
            {renderTableBody()}
          </tbody>
        </table>

        <Pagination
          currentPage={safePage}
          totalPages={totalPages}
          totalItems={filtered.length}
          perPage={perPage}
          onPageChange={handlePageChange}
          onPerPageChange={handlePerPageChange}
        />
      </div>
    </AdminLayout>
  );
}