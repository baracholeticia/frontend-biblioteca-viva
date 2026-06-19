import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Hero.css';
// Importando a logo da escola
import logoEscola from '../../assets/logos/escola.png'; 

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

    return (
        <section className="hero">
            {/* Logo adicionada aqui */}
            <img src={logoEscola} alt="Logo Escola" className="hero-logo" />
            
            <h2 className="school-name">EREM Abílio Monteiro</h2>
            <h1>BIBLIOTECA VIVA</h1>
            <p className="subtitle">A biblioteca tá on!</p>

            <p className="location">
                Lagoa do Ouro - PE
            </p>

            <p className="description">
                Um espaço onde os estudantes
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
        </section>
    );
}