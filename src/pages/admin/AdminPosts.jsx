import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { getAllWorks, createWork, updateWork, deleteWork } from '../../services/workService';
import { useToast } from '../../context/ToastContext';
import { IconPencil, IconTrash, IconSearch, IconHeart, IconMessage, IconPlus, IconEye } from '../../components/icons';
import './AdminLayout.css';

const ChevronIcon = ({ expanded }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
    <polyline points="6 9 12 15 18 9"></polyline>
  </svg>
);

const typeEndpoints = {
  'Essay': 'essays', 'Cordel': 'cordels', 'Tale': 'tales', 'ShortStory': 'short-stories',
  'Article': 'articles', 'Infographic': 'infographics', 'Art': 'arts', 
  'Multimedia': 'multimedias', 'LibraLiterature': 'libra-literatures', 'Poem': 'poems'
};

const categoryTranslations = {
  'Essay': 'Redação Nota 10',
  'Cordel': 'Cordel',
  'Tale': 'Conto',
  'ShortStory': 'Crônica',
  'Article': 'Jornal da Escola',
  'Infographic': 'Infográfico',
  'Art': 'Arte',
  'Multimedia': 'Vídeo Autoral',
  'LibraLiterature': 'Literatura em Libras',
  'Poem': 'Poema',
  'BookClub': 'Clube de Leitura'
};

const initialForm = { type: 'Essay', title: '', author: '', description: '', content: '', url: '', duration: '', genre: '', rhymeScheme: '', rate: 0, theme: 'Geral', themeDescription: 'Tema Geral', feedback: 'Sem feedback' };

function convertToIsoDuration(timeStr) {
  if (!timeStr) return '';
  if (timeStr.startsWith('PT')) return timeStr; 
  if (timeStr.includes(':')) { const [minutos, segundos] = timeStr.split(':'); return `PT${parseInt(minutos || 0, 10)}M${parseInt(segundos || 0, 10)}S`; }
  return `PT${parseInt(timeStr || 0, 10)}M`;
}

function convertFromIsoDuration(durationInfo) {
  if (!durationInfo) return '';
  if (typeof durationInfo === 'object' && durationInfo.seconds !== undefined) {
    const m = Math.floor(durationInfo.seconds / 60).toString().padStart(2, '0');
    const s = (durationInfo.seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
  if (typeof durationInfo === 'string' && durationInfo.startsWith('PT')) {
    const minMatch = durationInfo.match(/(\d+)M/);
    const secMatch = durationInfo.match(/(\d+)S/);
    const m = minMatch ? minMatch[1].padStart(2, '0') : '00';
    const s = secMatch ? secMatch[1].padStart(2, '0') : '00';
    return `${m}:${s}`;
  }
  return durationInfo; 
}

export function AdminPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest'); 
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const { showToast } = useToast();

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getAllWorks();
      setPosts(data);
    } catch (error) {
      console.error(error); 
      showToast("Erro ao carregar posts.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  let filtered = posts.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.author?.toLowerCase().includes(search.toLowerCase())
  );

  filtered.sort((a, b) => {
      const dateA = new Date(a.publicationDate || 0).getTime();
      const dateB = new Date(b.publicationDate || 0).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const startEdit = (post) => {
    setEditing(post.id); setCreating(false);
    const postData = { ...initialForm, ...post };
    if (['Multimedia', 'LibraLiterature'].includes(post.type)) { postData.duration = convertFromIsoDuration(post.duration); }
    setForm(postData); 
  };

  const startCreate = () => { setCreating(true); setEditing(null); setForm(initialForm); };

  const handleSave = async () => {
    const basePayload = { title: form.title, author: form.author, description: form.description, publicationDate: new Date().toISOString() };
    let payload = {};
    switch (form.type) {
      case 'Essay': payload = { ...basePayload, content: form.content, rate: Number(form.rate), theme: form.theme, themeDescription: form.themeDescription, feedback: form.feedback }; break;
      case 'Cordel': payload = { ...basePayload, content: form.content, rhymeScheme: form.rhymeScheme }; break;
      case 'Tale': payload = { ...basePayload, content: form.content, genre: form.genre }; break;
      case 'ShortStory': case 'Article': payload = { ...basePayload, content: form.content }; break;
      case 'Multimedia': case 'LibraLiterature': payload = { ...basePayload, url: form.url, duration: convertToIsoDuration(form.duration) }; break;
      case 'Art': case 'Infographic': payload = { ...basePayload, url: form.url }; break;
      default: payload = { ...basePayload };
    }
    const endpointType = typeEndpoints[form.type];
    try {
      if (creating) { await createWork(endpointType, payload); showToast("Criado!", "success"); } 
      else { await updateWork(endpointType, editing, payload); showToast("Atualizado!", "success"); }
      setCreating(false); setEditing(null); fetchPosts();
    } catch (error) { 
      console.error(error); 
      showToast("Erro ao salvar post.", "error"); 
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Excluir este post?')) {
      try { await deleteWork(id); showToast("Excluído.", "success"); fetchPosts(); } 
      catch (error) { 
        console.error(error);
        showToast("Erro ao excluir.", "error"); 
      }
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 }}>
        <div>
          <h1 className="admin-page-title">Posts</h1>
          <p className="admin-page-subtitle">{posts.length} publicações no total</p>
        </div>
        <button className="action-btn btn-primary" onClick={startCreate} style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <IconPlus size={16} /> <span className="action-text">Novo Post</span>
        </button>
      </div>

      {(editing !== null || creating) && (
        <div className="admin-card" style={{ marginBottom: 24, borderLeft: '4px solid #d62828' }}>
          <h2 style={{ color: '#0a2a57', fontSize: 17, fontWeight: 700, marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center' }}><IconPencil size={18} /> {creating ? 'Criar Post' : 'Editar Post'}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={labelStyle}>Tipo (Categoria)</label>
              <select style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} disabled={!creating}>
                {Object.keys(typeEndpoints).map(k => (
                  <option key={k} value={k}>{categoryTranslations[k] || k}</option>
                ))}
              </select>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><label style={labelStyle}>Título</label><input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><label style={labelStyle}>Autor</label><input style={inputStyle} value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /></div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><label style={labelStyle}>Descrição</label><input style={inputStyle} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            {['Essay', 'Cordel', 'Tale', 'ShortStory', 'Article'].includes(form.type) && (<div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1/-1' }}><label style={labelStyle}>Conteúdo</label><textarea style={{ ...inputStyle, minHeight: 180 }} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} /></div>)}
            {['Art', 'Infographic', 'Multimedia', 'LibraLiterature'].includes(form.type) && (<div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1/-1' }}><label style={labelStyle}>URL (Imagem/Youtube)</label><input style={inputStyle} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} /></div>)}
            {['Multimedia', 'LibraLiterature'].includes(form.type) && (<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><label style={labelStyle}>Duração (03:30)</label><input style={inputStyle} value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} /></div>)}
            {form.type === 'Cordel' && (<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><label style={labelStyle}>Rimas</label><input style={inputStyle} value={form.rhymeScheme} onChange={e => setForm({ ...form, rhymeScheme: e.target.value })} /></div>)}
            {form.type === 'Tale' && (<div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><label style={labelStyle}>Gênero</label><input style={inputStyle} value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} /></div>)}
            {form.type === 'Essay' && (<><div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><label style={labelStyle}>Nota</label><input type="number" style={inputStyle} value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} /></div><div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}><label style={labelStyle}>Tema</label><input style={inputStyle} value={form.theme} onChange={e => setForm({ ...form, theme: e.target.value })} /></div></>)}
          </div>
          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="action-btn btn-primary" onClick={handleSave}>Salvar</button>
            <button className="action-btn btn-view" onClick={() => { setEditing(null); setCreating(false); }}>Cancelar</button>
          </div>
        </div>
      )}

      <div className="admin-card">
        <div className="admin-controls-bar">
          <div className="admin-search-input">
            <IconSearch size={18} color="#6b778c" />
            <input
              style={{ border: 'none', padding: '10px 0', fontSize: 14, width: '100%', outline: 'none' }}
              placeholder="Buscar por título ou autor..."
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
              <th>Título</th>
              <th className="desktop-cell">Autor</th>
              <th className="desktop-cell">Categoria</th>
              <th className="desktop-cell"><IconHeart size={16} /></th>
              <th className="desktop-cell"><IconMessage size={16} /></th>
              <th className="desktop-cell">Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>Carregando posts...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>Nenhum post encontrado.</td></tr>
            ) : filtered.map(post => (
              <tr key={post.id}>
                <td>
                  <div className="row-header" onClick={() => toggleExpand(post.id)}>
                    <span style={{ fontWeight: 600 }} className="truncate-text">{post.title}</span>
                    <button className="mobile-expand-btn"><ChevronIcon expanded={expandedId === post.id} /></button>
                  </div>
                  
                  {expandedId === post.id && (
                    <div className="mobile-expanded-content">
                      <p><strong>Autor:</strong> {post.author}</p>
                      <p><strong>Categoria:</strong> <span className="badge badge-active" style={{ fontSize: 11 }}>{categoryTranslations[post.type] || post.type}</span></p>
                      
                      <div style={{ display: 'flex', gap: 16, marginTop: 8, marginBottom: 8 }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#d62828' }}><IconHeart size={14} color="#d62828" /> {post.likeCount || 0}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#6b778c' }}><IconMessage size={14} /> {post.commentCount || 0}</span>
                      </div>

                      <div className="admin-table-actions">
                        <button className="action-btn btn-view" onClick={() => navigate(`/post/${post.id}`)}><IconEye size={14} /> <span className="action-text">Ver</span></button>
                        <button className="action-btn btn-edit" onClick={() => startEdit(post)}><IconPencil size={14} /> <span className="action-text">Editar</span></button>
                        <button className="action-btn btn-delete" onClick={() => handleDelete(post.id)}><IconTrash size={14} /> <span className="action-text">Excluir</span></button>
                      </div>
                    </div>
                  )}
                </td>
                
                <td className="desktop-cell">{post.author}</td>
                <td className="desktop-cell"><span className="badge badge-active" style={{ fontSize: 11 }}>{categoryTranslations[post.type] || post.type}</span></td>
                <td className="desktop-cell"><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconHeart size={14} color="#d62828" /> {post.likeCount || 0}</div></td>
                <td className="desktop-cell"><div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconMessage size={14} color="#6b778c" /> {post.commentCount || 0}</div></td>
                <td className="desktop-cell">
                  <div className="admin-table-actions">
                    <button className="action-btn btn-view" onClick={() => navigate(`/post/${post.id}`)}><IconEye size={14} /> <span className="action-text">Ver</span></button>
                    <button className="action-btn btn-edit" onClick={() => startEdit(post)}><IconPencil size={14} /> <span className="action-text">Editar</span></button>
                    <button className="action-btn btn-delete" onClick={() => handleDelete(post.id)}><IconTrash size={14} /> <span className="action-text">Excluir</span></button>
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

const labelStyle = { fontSize: 13, fontWeight: 600, color: '#42526e' };
const inputStyle = { padding: '10px 14px', border: '1px solid #dfe1e6', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#0a2a57', width: '100%', boxSizing: 'border-box' };