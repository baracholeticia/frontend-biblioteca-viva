import './Essays.css';

export function Essays() {
    const redacoes = [
        { id: 1, tag: "Cultura", titulo: "Tema da Redação", autor: "Ana Clara Silva", data: "20 Nov 2025", views: 124, likes: 56 },
        { id: 2, tag: "Redes Sociais", titulo: "Tema da Redação", autor: "João Pedro Santos", data: "18 Nov 2025", views: 87, likes: 42 },
        { id: 3, tag: "Meio Ambiente", titulo: "Tema da Redação", autor: "Maria Eduarda Costa", data: "15 Nov 2025", views: 156, likes: 98 },
        { id: 4, tag: "Educação", titulo: "Título da Redação", autor: "Lucas Mendes", data: "12 Nov 2025", views: 76, likes: 34 },
    ];

    return (
        <section className="essays-section">
            <div className="essays-container">
                <div className="essays-header">
                    <div>
                        <h2 className="essays-title">
                            🏅 Redações Nota 10
                        </h2>
                        <p className="essays-subtitle">Redações de excelência escritas pelos nossos alunos</p>
                    </div>
                    <a href="#" className="ver-todas">Ver todas →</a>
                </div>

                <div className="essays-grid">
                    {redacoes.map((r) => (
                        <div className="essay-card" key={r.id}>
                            <div className="card-top">
                                <span className="card-tag">{r.tag}</span>
                                <span className="card-badge">🏅 Nota 10</span>
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
                                    <span>👁 {r.views}</span>
                                    <span>👍 {r.likes}</span>
                                    <span>⬇</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}