import { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from './AdminLayout';
import { getAllWorks } from '../../services/workService';
import { getComments, updateComment, deleteComment } from '../../services/commentService';
import { useToast } from '../../context/ToastContext';
import { IconPencil, IconTrash, IconSearch, IconCheck, IconClose } from '../../components/icons';
import './AdminLayout.css';

export function AdminComments() {
  const [allComments, setAllComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const { showToast } = useToast();

  const fetchAllComments = useCallback(async () => {
    try {
      setLoading(true);
      const works = await getAllWorks();
      
      const commentsPromises = works.map(async (work) => {
        try {
          const comments = await getComments(work.id);
          return comments.map(c => ({ ...c, workId: work.id, workTitle: work.title }));
        } catch (error) {
          console.error(`Erro ao buscar comentários da obra ${work.id}:`, error);
          return []; 
        }
      });
      
      const results = await Promise.all(commentsPromises);
      const flattened = results.flat().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setAllComments(flattened);
    } catch (error) {
      console.error("Erro na busca geral de obras:", error);
      showToast("Erro ao carregar comentários do servidor.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAllComments();
  }, [fetchAllComments]);

  const filtered = allComments.filter(c =>
    c.content?.toLowerCase().includes(search.toLowerCase()) ||
    c.authorName?.toLowerCase().includes(search.toLowerCase()) ||
    c.workTitle?.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.content);
  };

  const saveEdit = async (comment) => {
    try {
      await updateComment(comment.workId, comment.id, editText);
      showToast("Comentário atualizado!", "success");
      setEditingId(null);
      fetchAllComments(); // Recarrega a lista
    } catch (error) {
      console.error("Erro ao atualizar comentário:", error);
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
        console.error("Erro ao excluir comentário:", error);
        showToast("Erro ao excluir comentário.", "error");
      }
    }
  };

  return (
    <AdminLayout>
      <h1 className="admin-page-title">Comentários</h1>
      <p className="admin-page-subtitle">{allComments.length} comentários no total</p>

      <div className="admin-card">
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #dfe1e6', borderRadius: 8, padding: '0 14px', maxWidth: 400 }}>
          <IconSearch size={18} color="#6b778c" />
          <input
            style={{ ...inputStyle, border: 'none', padding: '10px 0', outline: 'none', maxWidth: '100%' }}
            placeholder="Buscar por texto, autor ou post..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Autor</th>
              <th>Comentário</th>
              <th>Post Origem</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="4" style={{textAlign:'center'}}>Carregando comentários...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="4" style={{textAlign:'center'}}>Nenhum comentário encontrado.</td></tr>
            ) : filtered.map(comment => (
              <tr key={comment.id}>
                <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{comment.authorName}</td>
                <td style={{ maxWidth: 340 }}>
                  {editingId === comment.id ? (
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <input
                        style={{ ...inputStyle, flex: 1 }}
                        value={editText}
                        onChange={e => setEditText(e.target.value)}
                        autoFocus
                      />
                      <button className="action-btn btn-approve" onClick={() => saveEdit(comment)} style={{ display: 'flex', padding: 6 }}>
                        <IconCheck size={16} />
                      </button>
                      <button className="action-btn btn-view" onClick={() => setEditingId(null)} style={{ display: 'flex', padding: 6 }}>
                        <IconClose size={16} />
                      </button>
                    </div>
                  ) : (
                    <span style={{ color: '#42526e', fontSize: 14 }}>{comment.content}</span>
                  )}
                </td>
                <td style={{ fontSize: 13, color: '#6b778c', maxWidth: 180 }}>{comment.workTitle}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="action-btn btn-edit" onClick={() => startEdit(comment)} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <IconPencil size={14} /> Editar
                    </button>
                    <button className="action-btn btn-delete" onClick={() => handleDelete(comment)} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <IconTrash size={14} /> Excluir
                    </button>
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

const inputStyle = {
  padding: '10px 14px', border: '1px solid #dfe1e6', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#0a2a57', width: '100%', boxSizing: 'border-box'
};