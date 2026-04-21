import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';

export function Hero() {
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    function handleSearch() {
        const q = query.trim();
        if (!q) return;
        navigate(`/busca?search=${encodeURIComponent(q)}`);
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') handleSearch();
    }

    function handleExplore() {
        const section = document.getElementById('acervo');
        if (section) section.scrollIntoView({ behavior: 'smooth' });
    }

    return (
        <section className="hero">
            <h1>BIBLIOTECA VIVA</h1>
            <p className="subtitle">A biblioteca tá on!</p>

            <p className="location">
                EREM Abílio Monteiro, Lagoa do Ouro - PE
            </p>

            <p className="description">
                Leitura, Escrita e Protagonismo Digital. Um espaço onde os estudantes
                compartilham suas produções autorais e inspiram outros a criar.
                Juntos construímos conhecimento.
            </p>

            <div className="search-container">
                <input
                    type="text"
                    placeholder="Buscar redações, contos, vídeos..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button className="search-btn" onClick={handleSearch}>BUSCAR</button>
            </div>

            <div className="actions">
                <button className="secondary-btn" onClick={handleExplore}>
                    Explorar Acervo
                </button>
            </div>
        </section>
    );
}