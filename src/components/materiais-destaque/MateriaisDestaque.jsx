import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllWorks } from '../../services/workService';
import { IconEye, IconHeart, IconDownload } from '../icons';
import './MateriaisDestaque.css';
import { getYoutubeThumbnail } from '../multimidia/Multimidia';

const typeToRoute = {
  'Essay': 'redacoes', 'Cordel': 'cordeis', 'Tale': 'contos', 'ShortStory': 'cronicas',
  'Article': 'jornal', 'Infographic': 'infograficos', 'Art': 'artes', 'Multimedia': 'videos', 'LibraLiterature': 'libras'
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

export function MateriaisDestaque() {
  const [materiais, setMateriais] = useState([]);

  useEffect(() => {
    async function fetchDestaques() {
      try {
        const data = await getAllWorks();
        // Ordena por quantidade de curtidas e pega os 4 primeiros
        const destaques = data.sort((a, b) => (b.likeCount || 0) - (a.likeCount || 0)).slice(0, 4);
        setMateriais(destaques);
      } catch (error) {
        console.error("Erro ao buscar materiais em destaque:", error);
      }
    }
    fetchDestaques();
  }, []);

  if (materiais.length === 0) return null;

  return (
    <section className="md-section">
      <div className="md-container">

        <div className="md-header">
          <div className="md-header__left">
            <h1 className="md-header__title">Materiais em Destaque</h1>
            <p className="md-header__subtitle">Contribuições mais curtidas da nossa comunidade</p>
          </div>
        </div>

        <div className="md-grid">
          {materiais.map((item) => {
            const route = typeToRoute[item.type] || 'redacoes';
            const translatedType = categoryTranslations[item.type] || item.type;
            
            let image = item.url;
            if (item.type === 'LibraLiterature' || item.type === 'Multimedia') {
              image = getYoutubeThumbnail(item.url);
            }
            
            const hasImage = !!image;

            return (
              <Link 
                to={`/${route}/${item.id}`} 
                className={`md-card ${!hasImage ? 'md-card--text-only' : ''}`} 
                key={item.id} 
                style={{ textDecoration: 'none' }}
              >
                {/* Só renderiza a área de imagem se realmente existir uma */}
                {hasImage && (
                  <div className="md-card__img-wrap">
                    <img src={image} alt={item.title} className="md-card__img" />
                    <span className="md-card__badge">{translatedType}</span>
                  </div>
                )}

                <div className="md-card__body">
                  {/* Se não tem imagem, renderiza a tag dentro do corpo do card */}
                  {!hasImage && (
                    <div className="md-card__badge-wrapper">
                      <span className="md-card__badge md-card__badge--static">{translatedType}</span>
                    </div>
                  )}
                  <h2 className="md-card__title">{item.title}</h2>
                  <p className="md-card__author">por {item.author}</p>
                  <p className="md-card__shared">{item.description}</p>
                </div>

                <div className="md-card__footer">
                  <div className="md-card__stats">
                    <span className="md-card__stat"><IconEye size={16} /> {item.viewCount || 0}</span>
                    <span className="md-card__stat"><IconHeart size={16} /> {item.likeCount || 0}</span>
                  </div>
                  <button className="md-card__download" aria-label="Download" onClick={(e) => e.preventDefault()}>
                    <IconDownload size={18} />
                  </button>
                </div>
              </Link>
            )
          })}
        </div>

      </div>
    </section>
  );
}