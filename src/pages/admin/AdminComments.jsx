import { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { posts as initialPosts } from '../../data/posts';
import { IconPencil, IconTrash, IconSearch, IconCheck, IconClose } from '../../components/icons';
import './AdminLayout.css';

function flattenComments(posts) {
  return posts.flatMap(post =>
    post.initialComments.map(c => ({
      ...c,
      postId: post.id,
      postTitle: post.title,
    }))
  );
}

export function AdminComments() {
  const [posts, setPosts] = useState(initialPosts);
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [search, setSearch] = useState('');

  const allComments = flattenComments(posts);
  const filtered = allComments.filter(c =>
    c.text.toLowerCase().includes(search.toLowerCase()) ||
    c.author.toLowerCase().includes(search.toLowerCase()) ||
    c.postTitle.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (comment) => {
    setEditingId(comment.id);
    setEditText(comment.text);
  };

  const saveEdit = (comment) => {
    setPosts(posts.map(post => {
      if (post.id !== comment.postId) return post;
      return {
        ...post,
        initialComments: post.initialComments.map(c =>
          c.id === comment.id ? { ...c, text: editText } : c
        )
      };
    }));
    setEditingId(null);
  };

  const deleteComment = (comment) => {
    if (window.confirm('Excluir este comentário?')) {
      setPosts(posts.map(post => {
        if (post.id !== comment.postId) return post;
        return {
          ...post,
          initialComments: post.initialComments.filter(c => c.id !== comment.id)
        };
      }));
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
              <th>Post</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(comment => (
              <tr key={`${comment.postId}-${comment.id}`}>
                <td style={{ fontWeight: 600, whiteSpace: 'nowrap' }}>{comment.author}</td>
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
                    <span style={{ color: '#42526e', fontSize: 14 }}>{comment.text}</span>
                  )}
                </td>
                <td style={{ fontSize: 13, color: '#6b778c', maxWidth: 180 }}>{comment.postTitle}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="action-btn btn-edit" onClick={() => startEdit(comment)} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <IconPencil size={14} /> Editar
                    </button>
                    <button className="action-btn btn-delete" onClick={() => deleteComment(comment)} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <IconTrash size={14} /> Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', padding: '30px 0', color: '#6b778c' }}>Nenhum comentário encontrado.</p>
        )}
      </div>
    </AdminLayout>
  );
}

const inputStyle = {
  padding: '10px 14px',
  border: '1px solid #dfe1e6',
  borderRadius: 8,
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
  color: '#0a2a57',
  width: '100%',
  boxSizing: 'border-box',
};