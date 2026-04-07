import { Link } from 'react-router-dom';
import { IconAward, IconEye, IconThumb, IconDownload } from '../icons';
import './Essays.css';

const redacoes = [
  { id: 1, tag: 'Cultura',       titulo: 'A Desigualdade Social no Brasil',     autor: 'Ana Clara Silva',    data: '20 Nov 2025', views: 124, likes: 56, postId: 1 },
  { id: 2, tag: 'Redes Sociais', titulo: 'Os Desafios da Educação no Século XXI',autor: 'João Pedro Santos', data: '18 Nov 2025', views: 87,  likes: 42, postId: 2 },
  { id: 3, tag: 'Meio Ambiente', titulo: 'Perspectivas sobre o Clima no Nordeste',autor: 'Maria Eduarda Costa',data: '15 Nov 2025', views: 156, likes: 98, postId: 1 },
  { id: 4, tag: 'Educação',      titulo: 'O Futuro da Tecnologia no Brasil',     autor: 'Lucas Mendes',      data: '12 Nov 2025', views: 76,  likes: 34, postId: 2 },
];

export function Essays() {
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
          <button className="ver-todas">Ver todas →</button>
        </div>

        <div className="essays-grid">
          {redacoes.map((r) => (
            <Link to={`/redacoes/${r.postId}`} key={r.id} className="essay-card">
              <div className="card-top">
                <span className="card-tag">{r.tag}</span>
                <span className="card-badge">
                  <IconAward size={13} color="#fff" /> Nota 10
                </span>
              </div>
              <div className="card-body">
                <h3>{r.titulo}</h3>
                <p className="card-date">{r.data}</p>
              </div>
              <div className="card-info">
                <span className="card-author">
                  <strong>Por:</strong> {r.autor}
                </span>
                <div className="card-stats">
                  <span><IconEye size={15} /> {r.views}</span>
                  <span><IconThumb size={15} /> {r.likes}</span>
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