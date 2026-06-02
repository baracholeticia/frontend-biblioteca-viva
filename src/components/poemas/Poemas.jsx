import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllWorks } from '../../services/workService';
import { IconPencil, IconEye, IconHeart } from '../icons';
import './Poemas.css';

function formatDate(dateString) {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function Poemas() {
    const [poems, setPoems] = useState([]);

    useEffect(() => {
        async function fetchPoems() {
            try {
                const allWorks = await getAllWorks();
                const filtered = allWorks
                    .filter(w => w.type === 'Poem' || w.type === 'POEM')
                    .slice(0, 6)
                    .map(w => ({
                        id: w.id,
                        subtype: w.poemType || 'Poema',
                        title: w.title,
                        excerpt: w.description || '',
                        date: formatDate(w.publicationDate),
                        author: w.authorName || w.author || 'Estudante',
                        views: w.viewCount || 0,
                        likes: w.likeCount || 0,
                    }));
                if (filtered.length > 0) setPoems(filtered);
            } catch (error) {
                console.error('Erro ao buscar poemas:', error);
            }
        }
        fetchPoems();
    }, []);

    return (
        <section className="poemas-section">
            <div className="poemas-header">
                <div>
                    <h2 className="poemas-titulo">
                        <IconPencil size={26} color="#e63946" />
                        Poemas
                    </h2>
                    <p className="poemas-descricao">Expressões poéticas dos nossos estudantes</p>
                </div>
                <Link to="/categoria/poemas" className="poemas-ver-todos">
                    Ver todos →
                </Link>
            </div>

            <div className="poemas-grid">
                {poems.map((poem) => (
                    <Link to={`/obra/${poem.id}`} key={poem.id} className="poema-card">
                        <div className="poema-topo">
                            <div className="poema-topo-header">
                                <span className="poema-subtipo">{poem.subtype}</span>
                                <IconPencil size={16} color="#fcbf49" />
                            </div>
                            <h3 className="poema-titulo">{poem.title}</h3>
                            <div className="poema-trecho-wrapper">
                                <blockquote className="poema-trecho">{poem.excerpt}</blockquote>
                            </div>
                            <p className="poema-data">{poem.date}</p>
                        </div>

                        <div className="poema-base">
                            <p className="poema-autor">
                                <strong>Por:</strong> {poem.author}
                            </p>
                            <div className="poema-stats">
                                <span className="poema-stat">
                                  <IconEye size={15} color="#6b778c" />
                                    {poem.views}
                                </span>
                                <span className="poema-stat">
                                  <IconHeart size={15} color="#e63946" />
                                    {poem.likes}
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}