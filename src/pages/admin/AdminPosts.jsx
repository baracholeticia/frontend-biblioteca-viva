import { useState } from 'react';
import { AdminLayout } from './AdminLayout';
import { posts as initialPosts } from '../../data/posts';
import { categories } from '../../data/categories';
import { IconPencil, IconTrash, IconSearch, IconHeart, IconMessage, IconPlus } from '../../components/icons';
import './AdminLayout.css';

export function AdminPosts() {
  const [posts, setPosts] = useState(initialPosts);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', author: '', categoryId: 'redacoes', excerpt: '', content: '' });
  const [search, setSearch] = useState('');

  const filtered = posts.filter(p =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.author.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (post) => {
    setEditing(post.id);
    setCreating(false);
    setForm({ title: post.title, author: post.author, categoryId: post.categoryId, excerpt: post.excerpt, content: post.content });
  };

  const startCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm({ title: '', author: '', categoryId: 'redacoes', excerpt: '', content: '' });
  };

  const handleSave = () => {
    if (creating) {
      const cat = categories.find(c => c.id === form.categoryId);
      setPosts([...posts, {
        id: Date.now(),
        ...form,
        category: cat?.title ?? form.categoryId,
        date: new Date().toLocaleDateString('pt-BR'),
        initialLikes: 0,
        initialComments: []
      }]);
      setCreating(false);
    } else {
      setPosts(posts.map(p => p.id === editing ? { ...p, ...form } : p));
      setEditing(null);
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      setPosts(posts.filter(p => p.id !== id));
    }
  };

  const isFormOpen = editing !== null || creating;

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="admin-page-title">Posts</h1>
          <p className="admin-page-subtitle">{posts.length} publicações no total</p>
        </div>
        <button className="action-btn btn-primary" onClick={startCreate} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <IconPlus size={16} /> Novo Post
        </button>
      </div>

      {isFormOpen && (
        <div className="admin-card" style={{ marginBottom: 24, borderLeft: '4px solid #d62828' }}>
          <h2 style={{ color: '#0a2a57', fontSize: 17, fontWeight: 700, marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
            <IconPencil size={18} /> {creating ? 'Criar Novo Post' : 'Editar Post'}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={labelStyle}>Título</label>
              <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Título do post" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={labelStyle}>Autor</label>
              <input style={inputStyle} value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="Nome do autor" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={labelStyle}>Categoria</label>
              <select style={inputStyle} value={form.categoryId} onChange={e => setForm({ ...form, categoryId: e.target.value })}>
                {categories.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={labelStyle}>Resumo</label>
              <input style={inputStyle} value={form.excerpt} onChange={e => setForm({ ...form, excerpt: e.target.value })} placeholder="Breve descrição..." />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1/-1' }}>
              <label style={labelStyle}>Conteúdo</label>
              <textarea style={{ ...inputStyle, minHeight: 180, resize: 'vertical' }} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} placeholder="Conteúdo completo do post..." />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="action-btn btn-primary" onClick={handleSave}>Salvar</button>
            <button className="action-btn btn-view" onClick={() => { setEditing(null); setCreating(false); }}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8, background: '#fff', border: '1px solid #dfe1e6', borderRadius: 8, padding: '0 14px', maxWidth: 340 }}>
          <IconSearch size={18} color="#6b778c" />
          <input
            style={{ ...inputStyle, border: 'none', padding: '10px 0', outline: 'none' }}
            placeholder="Buscar por título ou autor..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        <table className="admin-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Categoria</th>
              <th>Data</th>
              <th><IconHeart size={16} /></th>
              <th><IconMessage size={16} /></th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(post => (
              <tr key={post.id}>
                <td style={{ fontWeight: 600, maxWidth: 220 }}>{post.title}</td>
                <td>{post.author}</td>
                <td><span className="badge badge-active" style={{ fontSize: 11 }}>{post.category}</span></td>
                <td>{post.date}</td>
                <td>{post.initialLikes}</td>
                <td>{post.initialComments.length}</td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="action-btn btn-edit" onClick={() => startEdit(post)} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <IconPencil size={14} /> Editar
                    </button>
                    <button className="action-btn btn-delete" onClick={() => handleDelete(post.id)} style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
                      <IconTrash size={14} /> Excluir
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <p style={{ textAlign: 'center', padding: '30px 0', color: '#6b778c' }}>Nenhum post encontrado.</p>
        )}
      </div>
    </AdminLayout>
  );
}

const labelStyle = { fontSize: 13, fontWeight: 600, color: '#42526e' };
const inputStyle = {
  padding: '10px 14px',
  border: '1px solid #dfe1e6',
  borderRadius: 8,
  fontSize: 14,
  outline: 'none',
  fontFamily: 'inherit',
  color: '#0a2a57',
  width: '100%',
  boxSizing: 'border-box'
};