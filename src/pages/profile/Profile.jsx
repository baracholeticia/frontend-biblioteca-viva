import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/header/Header';
import { getAllWorks } from '../../services/workService';
import { logout } from '../../services/authService';
import { IconBookmark } from '../../components/icons';
import './Profile.css';

export function Profile() {
    const navigate = useNavigate();
    const [allWorks, setAllWorks] = useState([]);
    const [works, setWorks] = useState([]);
    const [loadingWorks, setLoadingWorks] = useState(true);
    const [activeTab, setActiveTab] = useState('publicacoes');
    const [savedIds, setSavedIds] = useState(
        JSON.parse(localStorage.getItem('savedPosts') || '[]')
    );

    const email = localStorage.getItem('userEmail') || '';
    const name = localStorage.getItem('userName') || email.split('@')[0];

    const initials = name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0]?.toUpperCase())
        .join('');

    const [form, setForm] = useState({ name, email, password: '', confirmPassword: '' });
    const [formMsg, setFormMsg] = useState(null);
    const [saving, setSaving] = useState(false);

    const savedWorks = allWorks.filter((w) => savedIds.includes(w.id));

    useEffect(() => {
        getAllWorks()
            .then((data) => {
                setAllWorks(data);
                setWorks(data.filter(
                    (w) => w.author?.toLowerCase() === email.toLowerCase()
                ));
            })
            .catch(() => { setAllWorks([]); setWorks([]); })
            .finally(() => setLoadingWorks(false));
    }, [email]);

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    const handleSave = async (e) => {
        e.preventDefault();
        if (form.password && form.password !== form.confirmPassword) {
            setFormMsg({ type: 'error', text: 'As senhas não coincidem.' });
            return;
        }
        setSaving(true);
        setFormMsg(null);
        try {
            if (form.name) localStorage.setItem('userName', form.name);
            if (form.email) localStorage.setItem('userEmail', form.email);
            setFormMsg({ type: 'success', text: 'Perfil atualizado com sucesso!' });
        } catch {
            setFormMsg({ type: 'error', text: 'Erro ao atualizar perfil.' });
        } finally {
            setSaving(false);
        }
    };

    const handleUnsave = (e, postId) => {
        e.stopPropagation();
        const updated = savedIds.filter((i) => i !== postId);
        localStorage.setItem('savedPosts', JSON.stringify(updated));
        setSavedIds(updated);
    };

    const typeLabel = {
        Article: 'Artigo', Cordel: 'Cordel', Essay: 'Redação',
        ShortStory: 'Conto', Tale: 'Crônica', Art: 'Arte',
        Infographic: 'Infográfico', Multimedia: 'Vídeo', LibraLiterature: 'Libras',
    };

    const typeRoute = {
        Article: 'jornal', Cordel: 'cordeis', Essay: 'redacoes',
        ShortStory: 'cronicas', Tale: 'contos', Art: 'artes',
        Infographic: 'infograficos', Multimedia: 'videos', LibraLiterature: 'libras',
    };

    const WorkCard = ({ w, showUnsave = false }) => (
        <article
            className="work-card"
            onClick={() => navigate(`/${typeRoute[w.type] || w.type?.toLowerCase()}/${w.id}`)}
        >
            <div className="work-card__top-row">
                <div className="work-card__type">{typeLabel[w.type] || w.type}</div>
                {showUnsave && (
                    <button
                        className="work-card__unsave"
                        title="Remover dos salvos"
                        onClick={(e) => handleUnsave(e, w.id)}
                    >
                        <IconBookmark size={14} color="#0a2a57" />
                    </button>
                )}
            </div>
            <h3 className="work-card__title">{w.title}</h3>
            <p className="work-card__desc">{w.description}</p>
            <div className="work-card__meta">
                <span className="work-card__stat">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                    {w.viewCount ?? 0}
                </span>
                <span className="work-card__stat">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                    {w.likeCount ?? 0}
                </span>
                <span className="work-card__stat">
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                    {w.commentCount ?? 0}
                </span>
            </div>
        </article>
    );

    return (
        <>
            <Header />
            <main className="profile-page">

                <div className="profile-hero">
                    <div className="profile-hero__bg" />
                    <div className="profile-hero__content">
                        <div className="profile-avatar">{initials || '?'}</div>
                        <div className="profile-hero__info">
                            <h1 className="profile-name">{name}</h1>
                            <p className="profile-email">{email}</p>
                            <span className="profile-badge">Autor</span>
                        </div>
                        <button className="profile-logout-btn" onClick={handleLogout}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                                <polyline points="16 17 21 12 16 7"/>
                                <line x1="21" y1="12" x2="9" y2="12"/>
                            </svg>
                            Sair
                        </button>
                    </div>
                </div>

                <div className="profile-tabs">
                    <button
                        className={`profile-tab ${activeTab === 'publicacoes' ? 'profile-tab--active' : ''}`}
                        onClick={() => setActiveTab('publicacoes')}
                    >
                        Minhas Publicações
                        {works.length > 0 && <span className="profile-tab__count">{works.length}</span>}
                    </button>
                    <button
                        className={`profile-tab ${activeTab === 'salvos' ? 'profile-tab--active' : ''}`}
                        onClick={() => setActiveTab('salvos')}
                    >
                        Salvos
                        {savedIds.length > 0 && <span className="profile-tab__count">{savedIds.length}</span>}
                    </button>
                    <button
                        className={`profile-tab ${activeTab === 'editar' ? 'profile-tab--active' : ''}`}
                        onClick={() => setActiveTab('editar')}
                    >
                        Editar Perfil
                    </button>
                </div>

                <div className="profile-body">

                    {activeTab === 'publicacoes' && (
                        <section className="profile-works">
                            {loadingWorks ? (
                                <div className="profile-loading">
                                    <span className="profile-spinner" />
                                    <p>Carregando publicações...</p>
                                </div>
                            ) : works.length === 0 ? (
                                <div className="profile-empty">
                                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                        <polyline points="14 2 14 8 20 8"/>
                                        <line x1="16" y1="13" x2="8" y2="13"/>
                                        <line x1="16" y1="17" x2="8" y2="17"/>
                                        <polyline points="10 9 9 9 8 9"/>
                                    </svg>
                                    <p>Nenhuma publicação vinculada ainda.</p>
                                    <span>Suas obras aprovadas pelos administradores aparecerão aqui.</span>
                                </div>
                            ) : (
                                <div className="profile-works__grid">
                                    {works.map((w) => <WorkCard key={w.id} w={w} />)}
                                </div>
                            )}
                        </section>
                    )}

                    {activeTab === 'salvos' && (
                        <section className="profile-works">
                            {loadingWorks ? (
                                <div className="profile-loading">
                                    <span className="profile-spinner" />
                                    <p>Carregando salvos...</p>
                                </div>
                            ) : savedWorks.length === 0 ? (
                                <div className="profile-empty">
                                    <IconBookmark size={48} color="#a09880" />
                                    <p>Nenhuma publicação salva ainda.</p>
                                    <span>Posts que você salvar aparecerão aqui.</span>
                                </div>
                            ) : (
                                <div className="profile-works__grid">
                                    {savedWorks.map((w) => <WorkCard key={w.id} w={w} showUnsave />)}
                                </div>
                            )}
                        </section>
                    )}

                    {activeTab === 'editar' && (
                        <section className="profile-edit">
                            <form className="profile-form" onSubmit={handleSave}>
                                <div className="profile-form__group">
                                    <label htmlFor="pf-name">Nome</label>
                                    <input
                                        id="pf-name"
                                        type="text"
                                        value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })}
                                        placeholder="Seu nome"
                                    />
                                </div>
                                <div className="profile-form__group">
                                    <label htmlFor="pf-email">Email</label>
                                    <input
                                        id="pf-email"
                                        type="email"
                                        value={form.email}
                                        onChange={(e) => setForm({ ...form, email: e.target.value })}
                                        placeholder="seu@email.com"
                                    />
                                </div>
                                <div className="profile-form__divider">
                                    <span>Alterar senha</span>
                                </div>
                                <div className="profile-form__group">
                                    <label htmlFor="pf-pass">Nova senha</label>
                                    <input
                                        id="pf-pass"
                                        type="password"
                                        value={form.password}
                                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                                        placeholder="Deixe em branco para não alterar"
                                    />
                                </div>
                                <div className="profile-form__group">
                                    <label htmlFor="pf-confirm">Confirmar senha</label>
                                    <input
                                        id="pf-confirm"
                                        type="password"
                                        value={form.confirmPassword}
                                        onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                                        placeholder="Repita a nova senha"
                                    />
                                </div>
                                {formMsg && (
                                    <p className={`profile-form__msg profile-form__msg--${formMsg.type}`}>
                                        {formMsg.text}
                                    </p>
                                )}
                                <button type="submit" className="profile-form__submit" disabled={saving}>
                                    {saving ? 'Salvando...' : 'Salvar alterações'}
                                </button>
                            </form>
                        </section>
                    )}

                </div>
            </main>
        </>
    );
}