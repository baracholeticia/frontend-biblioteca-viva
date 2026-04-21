import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllWorks } from '../../services/workService';
import { IconAward, IconEye, IconMessage, IconDownload } from '../icons';
import './Essays.css';

export function Essays() {
  const [redacoes, setRedacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEssays() {
      try {
        const data = await getAllWorks('Essay');
        setRedacoes(data.slice(0, 4));
      } catch (error) {
        console.error("Erro ao buscar redações:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchEssays();
  }, []);

  const formatDate = (iso) => iso ? new Date(iso).toLocaleDateString('pt-BR') : '';

  if (loading || redacoes.length === 0) return null;

  return (
      <section className="essays-section">
        <div className="essays-container">
          <div className="essays-header">
            <div>
              <h2 className="essays-title">
                <span className="essays-title__icon"><IconAward size={22} color="#e63946" /></span>
                Redações Nota 10
              </h2>
              <p className="essays-subtitle">Redações de excelência escritas pelos nossos alunos</p>
            </div>
            <Link to="/categoria/redacoes" className="ver-todas" style={{ textDecoration: 'none' }}>Ver todas →</Link>
          </div>

          <div className="essays-grid">
            {redacoes.map((r) => (
                <Link to={`/redacoes/${r.id}`} key={r.id} className="essay-card">
                  <div className="card-top">
                    <span className="card-tag">Redação</span>
                    <span className="card-badge">
                  <IconAward size={13} color="#fff" /> Nota 10
                </span>
                  </div>
                  <div className="card-body">
                    <h3>{r.title}</h3>
                    <p className="card-date">{formatDate(r.publicationDate)}</p>
                  </div>
                  <div className="card-info">
                <span className="card-author">
                  <strong>Por:</strong> {r.author}
                </span>
                    <div className="card-stats">
                      <span><IconEye size={15} /> {r.viewCount || 0}</span>
                      <span><IconMessage size={15} /> {r.commentCount || 0}</span>
                      <span className="card-download"><IconDownload size={16} /></span>
                    </div>
                  </div>
                </Link>
            ))}
          </div>
        </div>
      </section>
  );
}