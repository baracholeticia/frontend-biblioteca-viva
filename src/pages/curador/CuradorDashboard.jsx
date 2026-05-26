import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CuradorLayout } from './CuradorLayout';
import { getAllWorks } from '../../services/workService';
import { useToast } from '../../context/ToastContext';
import { IconDoc, IconHeart } from '../../components/icons';
import '../admin/AdminLayout.css';

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
};

const ChevronIcon = ({ expanded }) => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
         style={{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s' }}>
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
);

export function CuradorDashboard() {
    const [recentWorks, setRecentWorks] = useState([]);
    const [totalWorks, setTotalWorks] = useState(0);
    const [loading, setLoading] = useState(true);
    const [expandedPostId, setExpandedPostId] = useState(null);
    const { showToast } = useToast();

    useEffect(() => {
        async function fetchData() {
            try {
                setLoading(true);
                const works = await getAllWorks(null, 5);
                setRecentWorks(works);
                const all = await getAllWorks(null, 1000);
                setTotalWorks(all.length);
            } catch (error) {
                console.error(error);
                showToast('Erro ao carregar dados.', 'error');
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [showToast]);

    if (loading) return <CuradorLayout><h1 className="admin-page-title">Carregando painel...</h1></CuradorLayout>;

    return (
        <CuradorLayout>
            <h1 className="admin-page-title">Painel do Curador</h1>

            <div className="admin-stats-grid">
                <Link to="/curador/posts" style={{ textDecoration: 'none' }}>
                    <div className="admin-stat-card" style={{ borderLeftColor: '#d62828' }}>
                        <div className="admin-stat-icon" style={{ color: '#d62828' }}><IconDoc size={24} /></div>
                        <div className="admin-stat-value" style={{ color: '#d62828' }}>{totalWorks}</div>
                        <div className="admin-stat-label">Total de Posts</div>
                    </div>
                </Link>
            </div>

            <div className="admin-card">
                <div className="admin-card-header">
                    <h2><IconDoc size={18} /> Posts Recentes</h2>
                    <Link to="/curador/posts" className="admin-link-ver-todos">Ver todos →</Link>
                </div>
                <table className="admin-table">
                    <thead>
                    <tr>
                        <th>Título</th>
                        <th className="desktop-cell">Autor</th>
                        <th className="desktop-cell">Categoria</th>
                        <th className="desktop-cell">Curtidas</th>
                    </tr>
                    </thead>
                    <tbody>
                    {recentWorks.map(post => (
                        <tr key={post.id}>
                            <td>
                                <div className="row-header" onClick={() => setExpandedPostId(prev => prev === post.id ? null : post.id)}>
                                    <span style={{ fontWeight: 600 }} className="truncate-text">{post.title}</span>
                                    <button className="mobile-expand-btn"><ChevronIcon expanded={expandedPostId === post.id} /></button>
                                </div>
                                {expandedPostId === post.id && (
                                    <div className="mobile-expanded-content">
                                        <p><strong>Autor:</strong> {post.author}</p>
                                        <p><strong>Categoria:</strong> <span className="badge badge-active">{categoryTranslations[post.type] || post.type}</span></p>
                                        <p><strong>Curtidas:</strong> {post.likeCount || 0}</p>
                                    </div>
                                )}
                            </td>
                            <td className="desktop-cell">{post.author}</td>
                            <td className="desktop-cell"><span className="badge badge-active">{categoryTranslations[post.type] || post.type}</span></td>
                            <td className="desktop-cell">
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <IconHeart size={14} color="#d62828" /> {post.likeCount || 0}
                                </div>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </CuradorLayout>
    );
}