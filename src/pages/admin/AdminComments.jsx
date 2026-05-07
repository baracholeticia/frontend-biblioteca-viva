import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { getAllAdminComments } from '../../services/adminService';
import { updateComment, deleteComment } from '../../services/commentService';
import { useToast } from '../../context/ToastContext';
import { IconPencil, IconTrash, IconSearch, IconCheck, IconClose, IconEye } from '../../components/icons';
import './AdminLayout.css';

const ChevronIcon = ({ expanded }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

export function AdminComments() {
  const navigate = useNavigate();
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const { showToast } = useToast();

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  const fetchAllComments = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllAdminComments(0, 100); 
      setAllComments(data);
    } catch (error) {
      console.error(error); // Variável 'error' utilizada!
      showToast("Erro ao carregar comentários.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchAllComments(); }, [fetchAllComments]);

  let filtered = allComments.filter(c =>
    c.content?.toLowerCase().includes(search.toLowerCase()) ||
    c.authorName?.toLowerCase().includes(search.toLowerCase()) ||
    c.workTitle?.toLowerCase().includes(search.toLowerCase())
  );

  filtered.sort((a, b) => {
    const dateA = new Date(a.createdAt || 0).getTime();
    const dateB = new Date(b.createdAt || 0).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const startEdit = (comment) => { setEditingId(comment.id); setEditText(comment.content); };

  const saveEdit = async (comment) => {
    try { 
      await updateComment(comment.workId, comment.id, editText); 
      showToast("Comentário atualizado!", "success"); 
      setEditingId(null); 
      fetchAllComments(); 
    } catch (error) { 
      console.error(error); // Variável 'error' utilizada!
      showToast("Erro ao atualizar comentário.", "error"); 
    }
  };

  const handleDelete = async (comment) => {
    if (window.confirm('Excluir este comentário?')) {
      try { 
        await deleteComment(comment.workId, comment.id); 
        showToast("Excluído.", "success"); 
        fetchAllComments(); 
      } catch (error) { 
        console.error(error); // Variável 'error' utilizada!
        showToast("Erro ao excluir.", "error"); 
      }
    }
  };

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Comentários</h1>
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
            {loading ? (
              <tr><td colSpan="4" style={{textAlign:'center'}}>Carregando...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign:'center'}}>Nenhum comentário encontrado.</td></tr>
            ) : filtered.map(comment => (
              <tr key={comment.id}>
                
                <td>
                  <div className="row-header" onClick={() => toggleExpand(comment.id)}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <strong style={{ color: '#0a2a57' }}>{comment.authorName}</strong>
                      {editingId === comment.id ? (
                        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 8 }}>
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
                            WebkitLineClamp: expandedId === comment.id ? 'unset' : 2,
                            lineClamp: expandedId === comment.id ? 'unset' : 2 
                          }}
                        >
                          {comment.content}
                        </p>
                      )}
                    </div>
                    <button className="mobile-expand-btn"><ChevronIcon expanded={expandedId === comment.id} /></button>
                  </div>

                  {expandedId === comment.id && (
                    <div className="mobile-expanded-content">
                      <p><strong>Post:</strong> {comment.workTitle || 'Não especificado'}</p>
                      <div className="admin-table-actions" style={{ marginTop: 12 }}>
                        <button className="action-btn btn-view" onClick={() => navigate(`/post/${comment.workId}`)}><IconEye size={14} /> <span className="action-text">Ver</span></button>
                        <button className="action-btn btn-edit" onClick={() => startEdit(comment)}><IconPencil size={14} /> <span className="action-text">Editar</span></button>
                        <button className="action-btn btn-delete" onClick={() => handleDelete(comment)}><IconTrash size={14} /> <span className="action-text">Excluir</span></button>
                      </div>
                    </div>
                  )}
                </td>

                <td className="desktop-cell" style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{comment.authorName}</td>
                <td className="desktop-cell" style={{ fontSize: 13, color: '#6b778c', maxWidth: 180 }}>{comment.workTitle || 'Não especificado'}</td>
                <td className="desktop-cell">
                  <div className="admin-table-actions">
                    <button className="action-btn btn-view" onClick={() => navigate(`/post/${comment.workId}`)}><IconEye size={14} /> <span className="action-text">Ver</span></button>
                    <button className="action-btn btn-edit" onClick={() => startEdit(comment)}><IconPencil size={14} /> <span className="action-text">Editar</span></button>
                    <button className="action-btn btn-delete" onClick={() => handleDelete(comment)}><IconTrash size={14} /> <span className="action-text">Excluir</span></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AdminLayout>
  );
}

const inputStyle = { padding: '10px 14px', border: '1px solid #dfe1e6', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#0a2a57', width: '100%', boxSizing: 'border-box' };