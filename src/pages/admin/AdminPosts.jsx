import { useState, useEffect, useCallback } from 'react';
import { AdminLayout } from './AdminLayout';
import { getAllWorks, createWork, updateWork, deleteWork } from '../../services/workService';
import { useToast } from '../../context/ToastContext';
import { IconPencil, IconTrash, IconSearch, IconHeart, IconMessage, IconPlus } from '../../components/icons';
import './AdminLayout.css';

const typeEndpoints = {
  'Essay': 'essays', 'Cordel': 'cordels', 'Tale': 'tales', 'ShortStory': 'short-stories',
  'Article': 'articles', 'Infographic': 'infographics', 'Art': 'arts', 
  'Multimedia': 'multimedias', 'LibraLiterature': 'libra-literatures'
};

const initialForm = {
  type: 'Essay', title: '', author: '', description: '', content: '', 
  url: '', duration: '', genre: '', rhymeScheme: '', rate: 0, theme: 'Geral', themeDescription: 'Tema Geral', feedback: 'Sem feedback'
};

function convertToIsoDuration(timeStr) {
  if (!timeStr) return '';
  if (timeStr.startsWith('PT')) return timeStr; 
  
  if (timeStr.includes(':')) {
    const [minutos, segundos] = timeStr.split(':');
    return `PT${parseInt(minutos || 0, 10)}M${parseInt(segundos || 0, 10)}S`;
  }
  
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
  const [posts, setPosts] = useState([]);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

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

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const filtered = posts.filter(p =>
    p.title?.toLowerCase().includes(search.toLowerCase()) ||
    p.author?.toLowerCase().includes(search.toLowerCase())
  );

  const startEdit = (post) => {
    setEditing(post.id);
    setCreating(false);
    
    const postData = { ...initialForm, ...post };
    
    if (['Multimedia', 'LibraLiterature'].includes(post.type)) {
      postData.duration = convertFromIsoDuration(post.duration);
    }
    
    setForm(postData); 
  };

  const startCreate = () => {
    setCreating(true);
    setEditing(null);
    setForm(initialForm);
  };

  const handleSave = async () => {
    // dados padrao que TODAS as obras precisam ter
    const basePayload = {
      title: form.title,
      author: form.author,
      description: form.description,
      publicationDate: new Date().toISOString()
    };

    let payload = {};

    // dados especificos
    switch (form.type) {
      case 'Essay':
        payload = { ...basePayload, content: form.content, rate: Number(form.rate), theme: form.theme, themeDescription: form.themeDescription, feedback: form.feedback };
        break;
      case 'Cordel':
        payload = { ...basePayload, content: form.content, rhymeScheme: form.rhymeScheme };
        break;
      case 'Tale':
        payload = { ...basePayload, content: form.content, genre: form.genre };
        break;
      case 'ShortStory':
      case 'Article':
        payload = { ...basePayload, content: form.content };
        break;
      case 'Multimedia':
      case 'LibraLiterature':
        payload = { ...basePayload, url: form.url, duration: convertToIsoDuration(form.duration) };
        break;
      case 'Art':
      case 'Infographic':
        payload = { ...basePayload, url: form.url };
        break;
      default:
        payload = { ...basePayload };
    }

    const endpointType = typeEndpoints[form.type];

    try {
      if (creating) {
        await createWork(endpointType, payload);
        showToast("Post criado com sucesso!", "success");
      } else {
        await updateWork(endpointType, editing, payload);
        showToast("Post atualizado com sucesso!", "success");
      }
      setCreating(false);
      setEditing(null);
      fetchPosts();
    } catch (error) {
      console.error(error);

      showToast("Erro ao salvar post. Verifique os campos.", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este post?')) {
      try {
        await deleteWork(id);
        showToast("Post excluído com sucesso.", "success");
        fetchPosts();
      } catch (error) {
        console.error(error);
        showToast("Erro ao excluir post.", "error");
      }
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
              <label style={labelStyle}>Tipo de Obra</label>
              <select style={inputStyle} value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} disabled={!creating}>
                {Object.keys(typeEndpoints).map(k => <option key={k} value={k}>{k}</option>)}
              </select>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={labelStyle}>Título</label>
              <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="Título" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={labelStyle}>Autor</label>
              <input style={inputStyle} value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} placeholder="Autor" />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <label style={labelStyle}>Descrição / Resumo</label>
              <input style={inputStyle} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Breve descrição" />
            </div>

            {['Essay', 'Cordel', 'Tale', 'ShortStory', 'Article'].includes(form.type) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1/-1' }}>
                <label style={labelStyle}>Conteúdo (Texto completo)</label>
                <textarea style={{ ...inputStyle, minHeight: 180 }} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
              </div>
            )}

            {['Art', 'Infographic', 'Multimedia', 'LibraLiterature'].includes(form.type) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1/-1' }}>
                <label style={labelStyle}>URL (Imagem ou Vídeo Youtube)</label>
                <input style={inputStyle} value={form.url} onChange={e => setForm({ ...form, url: e.target.value })} placeholder="https://..." />
              </div>
            )}

            {['Multimedia', 'LibraLiterature'].includes(form.type) && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={labelStyle}>Duração do Vídeo (ex: 03:30)</label>
                <input style={inputStyle} value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="00:00" />
              </div>
            )}

            {form.type === 'Cordel' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={labelStyle}>Esquema de Rimas</label>
                <input style={inputStyle} value={form.rhymeScheme} onChange={e => setForm({ ...form, rhymeScheme: e.target.value })} placeholder="AABB" />
              </div>
            )}

            {form.type === 'Tale' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={labelStyle}>Gênero</label>
                <input style={inputStyle} value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} placeholder="Ficção" />
              </div>
            )}

            {form.type === 'Essay' && (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={labelStyle}>Nota (Rate 0-1000)</label>
                  <input type="number" style={inputStyle} value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} placeholder="950" />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={labelStyle}>Tema</label>
                  <input style={inputStyle} value={form.theme} onChange={e => setForm({ ...form, theme: e.target.value })} placeholder="Tema da redação" />
                </div>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
            <button className="action-btn btn-primary" onClick={handleSave}>Salvar Post</button>
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
              <th><IconHeart size={16} /></th>
              <th><IconMessage size={16} /></th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>Carregando posts...</td></tr>
            ) : filtered.length === 0 ? (
              <tr><td colSpan="6" style={{textAlign:'center'}}>Nenhum post encontrado.</td></tr>
            ) : filtered.map(post => (
              <tr key={post.id}>
                <td style={{ fontWeight: 600, maxWidth: 220 }}>{post.title}</td>
                <td>{post.author}</td>
                <td><span className="badge badge-active" style={{ fontSize: 11 }}>{post.type}</span></td>
                <td>{post.likeCount || 0}</td>
                <td>{post.commentCount || 0}</td>
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
      </div>
    </AdminLayout>
  );
}

const labelStyle = { fontSize: 13, fontWeight: 600, color: '#42526e' };
const inputStyle = { padding: '10px 14px', border: '1px solid #dfe1e6', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#0a2a57', width: '100%', boxSizing: 'border-box' };