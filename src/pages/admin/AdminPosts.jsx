import { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from './AdminLayout';
import { getAllWorks, getWorkById, createWork, updateWork, deleteWork } from '../../services/workService';
import { getAllBookClubs, createBookClub, updateBookClub, deleteBookClub } from '../../services/bookclubService';
import { getAllUsers } from '../../services/adminService';
import { useToast } from '../../context/ToastContext';
import { IconPencil, IconTrash, IconSearch, IconHeart, IconMessage, IconPlus, IconEye } from '../../components/icons';
import { Pagination } from '../../components/pagination/Pagination';
import './AdminLayout.css';

const YOUTUBE_API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;

const ChevronIcon = ({ expanded }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

function AuthorAutocomplete({ value, onChange, users }) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [prevValue, setPrevValue] = useState(value);
  const wrapperRef = useRef(null);

  if (value !== prevValue) {
    setPrevValue(value);
    setInputValue(value || '');
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = inputValue.trim().length > 0
      ? users.filter(u => {
        const q = inputValue.toLowerCase();
        return u.name?.toLowerCase().includes(q) || u.email?.toLowerCase().includes(q);
      }).slice(0, 6)
      : [];

  const handleInput = (e) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    setOpen(true);
  };

  const handleSelect = (user) => {
    setInputValue(user.name);
    onChange(user.name);
    setOpen(false);
  };

  return (
      <div ref={wrapperRef} style={{ position: 'relative' }}>
        <input
            style={inputStyle}
            value={inputValue}
            onChange={handleInput}
            onFocus={() => suggestions.length > 0 && setOpen(true)}
            placeholder="Nome ou e-mail do autor..."
            autoComplete="off"
        />
        {open && suggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
              background: 'white', border: '1px solid #dfe1e6', borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)', marginTop: 4, overflow: 'hidden'
            }}>
              {suggestions.map(user => (
                  <div
                      key={user.id}
                      onMouseDown={() => handleSelect(user)}
                      style={{
                        padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f0f2f5',
                        display: 'flex', flexDirection: 'column', gap: 2, transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f6f7f9'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#0a2a57' }}>{user.name}</span>
                    <span style={{ fontSize: 12, color: '#6b778c' }}>{user.email}</span>
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}

function ArtAutocomplete({ value, onChange, arts }) {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value || '');
  const [prevValue, setPrevValue] = useState(value);
  const wrapperRef = useRef(null);

  if (value !== prevValue) {
    setPrevValue(value);
    setInputValue(value || '');
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const suggestions = arts.filter(a => {
    const q = inputValue.toLowerCase();
    return !q || a.title?.toLowerCase().includes(q);
  }).slice(0, 8);

  const handleInput = (e) => {
    const val = e.target.value;
    setInputValue(val);
    onChange(val);
    setOpen(true);
  };

  const handleSelect = (art) => {
    setInputValue(art.title);
    onChange(art.title);
    setOpen(false);
  };

  return (
      <div ref={wrapperRef} style={{ position: 'relative' }}>
        <input
            style={inputStyle}
            value={inputValue}
            onChange={handleInput}
            onFocus={() => setOpen(true)}
            placeholder="Buscar arte vinculada..."
            autoComplete="off"
        />
        {open && suggestions.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100,
              background: 'white', border: '1px solid #dfe1e6', borderRadius: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.12)', marginTop: 4, overflow: 'hidden'
            }}>
              {suggestions.map(art => (
                  <div
                      key={art.id}
                      onMouseDown={() => handleSelect(art)}
                      style={{
                        padding: '10px 14px', cursor: 'pointer', borderBottom: '1px solid #f0f2f5',
                        display: 'flex', flexDirection: 'column', gap: 2, transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => e.currentTarget.style.background = '#f6f7f9'}
                      onMouseLeave={e => e.currentTarget.style.background = 'white'}
                  >
                    <span style={{ fontWeight: 600, fontSize: 14, color: '#0a2a57' }}>{art.title}</span>
                    {art.author && <span style={{ fontSize: 12, color: '#6b778c' }}>{art.author}</span>}
                  </div>
              ))}
            </div>
        )}
      </div>
  );
}

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

const initialForm = {
  type: 'Essay', title: '', author: '', studentClass: '', description: '',
  content: '', url: '', duration: '', genre: '', rhymeScheme: '', artName: '',
  poemType: '', rate: 0,
  theme: 'Geral', themeDescription: 'Tema Geral', feedback: 'Sem feedback',
  bookName: '', bookAuthor: '', bookSynopses: '', bookCoverUrl: '', date: '', location: ''
};

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

function extractYoutubeId(url) {
  const match = url.match(/(?:youtube\.com\/.*[?&]v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

async function fetchYoutubeDuration(url) {
  const videoId = extractYoutubeId(url);
  if (!videoId || !YOUTUBE_API_KEY) return null;
  try {
    const res = await fetch(
        `https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${videoId}&key=${YOUTUBE_API_KEY}`
    );
    const data = await res.json();
    const iso = data?.items?.[0]?.contentDetails?.duration;
    return iso ? convertFromIsoDuration(iso) : null;
  } catch {
    return null;
  }
}

function normalizeBookClub(bc) {
  return {
    ...bc,
    type: 'BookClub',
    title: bc.bookName,
    author: bc.organizerName,
    publicationDate: bc.date,
    _isBookClub: true,
  };
}

export function AdminPosts() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [filterCategory, setFilterCategory] = useState('');
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [sortOrder, setSortOrder] = useState('newest');
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [fetchingDuration, setFetchingDuration] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [arts, setArts] = useState([]);
  const { showToast } = useToast();

  const urlDebounceRef = useRef(null);

  const toggleExpand = (id) => setExpandedId(prev => prev === id ? null : id);

  const getViewPath = (post) =>
      post._isBookClub ? `/clube-leitura/${post.id}` : `/post/${post.id}`;

  const fetchPosts = useCallback(async () => {
    try {
      setLoading(true);
      const [worksData, bookClubsData] = await Promise.all([
        getAllWorks(),
        getAllBookClubs().then(res => {
          const list = Array.isArray(res) ? res : (res?.content ?? []);
          return list.map(normalizeBookClub);
        }).catch(() => [])
      ]);
      setPosts([...worksData, ...bookClubsData]);
    } catch (error) {
      console.error(error);
      showToast("Erro ao carregar posts.", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => { fetchPosts(); }, [fetchPosts]);

  useEffect(() => {
    getAllUsers().then(setUsers).catch(() => {});
  }, []);

  useEffect(() => {
    getAllWorks('Art').then(setArts).catch(() => {});
  }, []);

  const handleUrlChange = (url) => {
    setForm(prev => ({ ...prev, url }));
    if (!['Multimedia', 'LibraLiterature'].includes(form.type)) return;
    if (!extractYoutubeId(url)) return;
    clearTimeout(urlDebounceRef.current);
    urlDebounceRef.current = setTimeout(async () => {
      setFetchingDuration(true);
      const duration = await fetchYoutubeDuration(url);
      setFetchingDuration(false);
      if (duration) {
        setForm(prev => ({ ...prev, duration }));
        showToast("Duração preenchida automaticamente!", "success");
      } else {
        showToast("Não foi possível obter a duração. Preencha manualmente.", "error");
      }
    }, 800);
  };

  let filtered = posts.filter(p => {
    const matchSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
        p.author?.toLowerCase().includes(search.toLowerCase());
    const matchCategory = !filterCategory || p.type === filterCategory;
    return matchSearch && matchCategory;
  });

  filtered.sort((a, b) => {
    const dateA = new Date(a.publicationDate || 0).getTime();
    const dateB = new Date(b.publicationDate || 0).getTime();
    return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const handlePageChange = (page) => setCurrentPage(page);
  const handlePerPageChange = (value) => { setPerPage(value); setCurrentPage(1); };
  
  const startEdit = async (post) => {
    setCreating(false);

    if (post._isBookClub) {
      setEditing(post.id);
      setForm({
        ...initialForm,
        type: 'BookClub',
        bookName: post.bookName || '',
        bookAuthor: post.bookAuthor || '',
        bookSynopses: post.bookSynopses || '',
        bookCoverUrl: post.bookCoverUrl || '',
        date: post.date ? post.date.slice(0, 16) : '',
        location: post.location || '',
      });
      return;
    }

    try {
      setLoadingEdit(true);
      const fullPost = await getWorkById(post.id);
      setEditing(fullPost.id);
      const postData = { ...initialForm, ...fullPost };
      if (['Multimedia', 'LibraLiterature'].includes(fullPost.type)) {
        postData.duration = convertFromIsoDuration(fullPost.duration);
      }
      setForm(postData);
    } catch (error) {
      console.error(error);
      showToast("Erro ao carregar dados do post.", "error");
    } finally {
      setLoadingEdit(false);
    }
  };

  const startCreate = () => { setCreating(true); setEditing(null); setForm(initialForm); };

  const handleSave = async () => {
    if (saving) return;
    setSaving(true);
    try {
      if (form.type === 'BookClub') {
        const payload = {
          bookName: form.bookName,
          bookAuthor: form.bookAuthor,
          bookSynopses: form.bookSynopses,
          bookCoverUrl: form.bookCoverUrl,
          date: form.date ? new Date(form.date).toISOString() : new Date().toISOString(),
          location: form.location,
        };
        if (creating) { await createBookClub(payload); showToast("Clube criado!", "success"); }
        else { await updateBookClub(editing, payload); showToast("Clube atualizado!", "success"); }
        setCreating(false); setEditing(null); fetchPosts();
        return;
      }

      const matchedUser = users.find(u => u.email === form.author || u.name === form.author);
      const basePayload = {
        title: form.title,
        description: form.description,
        publicationDate: new Date().toISOString(),
        studentClass: form.studentClass || 'Não informado',
        ...(matchedUser ? { authorEmail: matchedUser.email } : { authorName: form.author }),
      };
      let payload = {};
      switch (form.type) {
        case 'Essay':
          payload = {
            ...basePayload,
            content: form.content,
            rate: Number(form.rate),
            theme: form.theme,
            themeDescription: form.themeDescription,
            feedback: form.feedback,
          };
          break;
        case 'Cordel':
          payload = { ...basePayload, content: form.content, rhymeScheme: form.rhymeScheme, artName: form.artName };
          break;
        case 'Tale':
          payload = { ...basePayload, content: form.content, genre: form.genre };
          break;
        case 'Poem':
          payload = { ...basePayload, content: form.content, rhymeScheme: form.rhymeScheme, poemType: form.poemType };
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
      if (creating) { await createWork(endpointType, payload); showToast("Criado!", "success"); }
      else { await updateWork(endpointType, editing, payload); showToast("Atualizado!", "success"); }
      setCreating(false); setEditing(null); fetchPosts();
    } catch (error) {
      console.error(error);
      if (error.response?.status === 409) {
        showToast("Já existe um clube de leitura ativo. Edite ou exclua o atual antes de criar um novo.", "error");
      } else {
        showToast("Erro ao salvar post.", "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (post) => {
    if (window.confirm('Excluir este item?')) {
      try {
        if (post._isBookClub) { await deleteBookClub(post.id); }
        else { await deleteWork(post.id); }
        showToast("Excluído.", "success");
        fetchPosts();
      } catch (error) {
        console.error(error);
        showToast("Erro ao excluir.", "error");
      }
    }
  };

  const isBookClub = form.type === 'BookClub';

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
              <h2 style={{ color: '#0a2a57', fontSize: 17, fontWeight: 700, marginBottom: 20, display: 'flex', gap: 8, alignItems: 'center' }}>
                <IconPencil size={18} /> {creating ? 'Criar Post' : 'Editar Post'}
                {loadingEdit && <span style={{ fontSize: 13, fontWeight: 400, color: '#6b778c', marginLeft: 8 }}>Carregando...</span>}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>

                {/* Tipo */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <label style={labelStyle}>Tipo (Categoria)</label>
                  <select style={inputStyle} value={form.type} onChange={e => setForm({ ...initialForm, type: e.target.value })} disabled={!creating}>
                    {[...Object.keys(typeEndpoints), 'BookClub'].map(k => (
                        <option key={k} value={k}>{categoryTranslations[k] || k}</option>
                    ))}
                  </select>
                </div>

                {/*Campos BookClub */}
                {isBookClub && (<>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={labelStyle}>Nome do Livro</label>
                    <input style={inputStyle} value={form.bookName} onChange={e => setForm({ ...form, bookName: e.target.value })} placeholder="Ex: Dom Casmurro" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={labelStyle}>Autor do Livro</label>
                    <input style={inputStyle} value={form.bookAuthor} onChange={e => setForm({ ...form, bookAuthor: e.target.value })} placeholder="Ex: Machado de Assis" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={labelStyle}>Data do Encontro</label>
                    <input type="datetime-local" style={inputStyle} value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={labelStyle}>Local</label>
                    <input style={inputStyle} value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} placeholder="Ex: Biblioteca Central" />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1/-1' }}>
                    <label style={labelStyle}>URL da Capa do Livro</label>
                    <input style={inputStyle} value={form.bookCoverUrl} onChange={e => setForm({ ...form, bookCoverUrl: e.target.value })} placeholder="https://..." />
                    {form.bookCoverUrl && (
                        <img src={form.bookCoverUrl} alt="Capa" style={{ marginTop: 8, height: 120, width: 80, objectFit: 'cover', borderRadius: 6, boxShadow: '0 2px 8px rgba(0,0,0,0.15)' }} onError={e => e.target.style.display = 'none'} />
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1/-1' }}>
                    <label style={labelStyle}>Sinopse</label>
                    <textarea style={{ ...inputStyle, minHeight: 120 }} value={form.bookSynopses} onChange={e => setForm({ ...form, bookSynopses: e.target.value })} placeholder="Breve descrição do livro..." />
                  </div>
                </>)}

                {/* ── Campos Works normais ── */}
                {!isBookClub && (<>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={labelStyle}>Título</label>
                    <input style={inputStyle} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={labelStyle}>
                      Autor
                      {form.author && users.find(u => u.name === form.author)
                          ? <span style={{ marginLeft: 8, fontSize: 11, color: '#065f46', background: '#d1fae5', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>✓ Perfil vinculado</span>
                          : form.author
                              ? <span style={{ marginLeft: 8, fontSize: 11, color: '#92400e', background: '#fef3c7', padding: '2px 8px', borderRadius: 10, fontWeight: 600 }}>Sem perfil vinculado</span>
                              : null
                      }
                    </label>
                    <AuthorAutocomplete value={form.author} users={users} onChange={(name) => setForm({ ...form, author: name })} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={labelStyle}>Descrição</label>
                    <input style={inputStyle} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <label style={labelStyle}>Turma</label>
                    <input style={inputStyle} value={form.studentClass} onChange={e => setForm({ ...form, studentClass: e.target.value })} placeholder="Ex: 9º A" />
                  </div>

                  {/* Conteúdo textual */}
                  {['Essay', 'Cordel', 'Tale', 'ShortStory', 'Article', 'Poem'].includes(form.type) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1/-1' }}>
                        <label style={labelStyle}>Conteúdo</label>
                        <textarea style={{ ...inputStyle, minHeight: 180 }} value={form.content} onChange={e => setForm({ ...form, content: e.target.value })} />
                      </div>
                  )}

                  {/* URL */}
                  {['Art', 'Infographic', 'Multimedia', 'LibraLiterature'].includes(form.type) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1/-1' }}>
                        <label style={labelStyle}>URL (Imagem/Youtube)</label>
                        <input style={inputStyle} value={form.url} onChange={e => handleUrlChange(e.target.value)} placeholder="Cole o link do YouTube..." />
                        {fetchingDuration && ['Multimedia', 'LibraLiterature'].includes(form.type) && (
                            <span style={{ fontSize: 12, color: '#6b778c', marginTop: 4 }}>⏳ Buscando duração no YouTube...</span>
                        )}
                      </div>
                  )}

                  {/* Duração */}
                  {['Multimedia', 'LibraLiterature'].includes(form.type) && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={labelStyle}>Duração (mm:ss) {fetchingDuration && <span style={{ marginLeft: 8, fontSize: 11, color: '#6b778c' }}>buscando...</span>}</label>
                        <input style={inputStyle} value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} placeholder="Ex: 03:30" />
                      </div>
                  )}

                  {/* Cordel */}
                  {form.type === 'Cordel' && (<>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={labelStyle}>Esquema de Rimas</label>
                      <input style={inputStyle} value={form.rhymeScheme} onChange={e => setForm({ ...form, rhymeScheme: e.target.value })} placeholder="Ex: ABCBDB" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={labelStyle}>Arte vinculada</label>
                      <ArtAutocomplete value={form.artName} arts={arts} onChange={(val) => setForm({ ...form, artName: val })} />
                    </div>
                  </>)}

                  {/* Tale */}
                  {form.type === 'Tale' && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                        <label style={labelStyle}>Gênero</label>
                        <input style={inputStyle} value={form.genre} onChange={e => setForm({ ...form, genre: e.target.value })} />
                      </div>
                  )}

                  {/* Poem */}
                  {form.type === 'Poem' && (<>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={labelStyle}>Tipo de Poema (poemType)</label>
                      <input style={inputStyle} value={form.poemType} onChange={e => setForm({ ...form, poemType: e.target.value })} placeholder="Ex: Soneto, Haiku, Livre..." />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={labelStyle}>Esquema de Rimas</label>
                      <input style={inputStyle} value={form.rhymeScheme} onChange={e => setForm({ ...form, rhymeScheme: e.target.value })} placeholder="Ex: ABAB, AABB..." />
                    </div>
                  </>)}

                  {/* Essay */}
                  {form.type === 'Essay' && (<>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={labelStyle}>Nota</label>
                      <input type="number" style={inputStyle} value={form.rate} onChange={e => setForm({ ...form, rate: e.target.value })} placeholder="0 - 1000" />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                      <label style={labelStyle}>Tema</label>
                      <input style={inputStyle} value={form.theme} onChange={e => setForm({ ...form, theme: e.target.value })} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1/-1' }}>
                      <label style={labelStyle}>Descrição do Tema</label>
                      <input style={inputStyle} value={form.themeDescription} onChange={e => setForm({ ...form, themeDescription: e.target.value })} placeholder="Ex: Tema sobre sustentabilidade..." />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 6, gridColumn: '1/-1' }}>
                      <label style={labelStyle}>Feedback</label>
                      <textarea style={{ ...inputStyle, minHeight: 80 }} value={form.feedback} onChange={e => setForm({ ...form, feedback: e.target.value })} placeholder="Feedback do avaliador..." />
                    </div>
                  </>)}
                </>)}
              </div>
              <div style={{ display: 'flex', gap: 10, marginTop: 16 }}>
                <button className="action-btn btn-primary" onClick={handleSave} disabled={saving || loadingEdit}>
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
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
            <select className="admin-select" value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
              <option value="">Todas as Categorias</option>
              {Object.entries(categoryTranslations).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
              ))}
            </select>
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
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Carregando posts...</td></tr>
            ) : filtered.length === 0 ? (
                <tr><td colSpan="6" style={{ textAlign: 'center' }}>Nenhum post encontrado.</td></tr>
            ) : paginated.map(post => (
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
                          {!post._isBookClub && (
                              <div style={{ display: 'flex', gap: 16, marginTop: 8, marginBottom: 8 }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#d62828' }}><IconHeart size={14} color="#d62828" /> {post.likeCount || 0}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 600, color: '#6b778c' }}><IconMessage size={14} /> {post.commentCount || 0}</span>
                              </div>
                          )}
                          <div className="admin-table-actions">
                            <button className="action-btn btn-view" onClick={() => navigate(getViewPath(post))}><IconEye size={14} /> <span className="action-text">Ver</span></button>
                            <button className="action-btn btn-edit" onClick={() => startEdit(post)}><IconPencil size={14} /> <span className="action-text">Editar</span></button>
                            <button className="action-btn btn-delete" onClick={() => handleDelete(post)}><IconTrash size={14} /> <span className="action-text">Excluir</span></button>
                          </div>
                        </div>
                    )}
                  </td>
                  <td className="desktop-cell">{post.author}</td>
                  <td className="desktop-cell"><span className="badge badge-active" style={{ fontSize: 11 }}>{categoryTranslations[post.type] || post.type}</span></td>
                  <td className="desktop-cell">
                    {post._isBookClub ? <span style={{ color: '#c0c7d0', fontSize: 12 }}>—</span> : <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconHeart size={14} color="#d62828" /> {post.likeCount || 0}</div>}
                  </td>
                  <td className="desktop-cell">
                    {post._isBookClub ? <span style={{ color: '#c0c7d0', fontSize: 12 }}>—</span> : <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}><IconMessage size={14} color="#6b778c" /> {post.commentCount || 0}</div>}
                  </td>
                  <td className="desktop-cell">
                    <div className="admin-table-actions">
                      <button className="action-btn btn-view" onClick={() => navigate(getViewPath(post))}><IconEye size={14} /> <span className="action-text">Ver</span></button>
                      <button className="action-btn btn-edit" onClick={() => startEdit(post)}><IconPencil size={14} /> <span className="action-text">Editar</span></button>
                      <button className="action-btn btn-delete" onClick={() => handleDelete(post)}><IconTrash size={14} /> <span className="action-text">Excluir</span></button>
                    </div>
                  </td>
                </tr>
            ))}
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

const labelStyle = { fontSize: 13, fontWeight: 600, color: '#42526e' };
const inputStyle = { padding: '10px 14px', border: '1px solid #dfe1e6', borderRadius: 8, fontSize: 14, outline: 'none', fontFamily: 'inherit', color: '#0a2a57', width: '100%', boxSizing: 'border-box' };