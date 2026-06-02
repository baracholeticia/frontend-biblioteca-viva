import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categories as initialCategories } from '../../data/categories';
import { getHomeData } from '../../services/workService';
// Importe a função que busca a lista geral de clubes de leitura
import { getAllBookClubs } from '../../services/bookclubService'; 
import './Sections.css';

export function Sections() {
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    async function fetchCounts() {
      try {
        // Busca os dados da home (trabalhos e produções)
        const data = await getHomeData();
        
        // Busca a lista de clubes de leitura para pegar o total armazenado
        let bookClubTotal = 0;
        try {
            const bookClubs = await getAllBookClubs();
            // Verifica se a API usa paginação (page.totalElements) ou apenas um array (content.length)
            bookClubTotal = bookClubs?.page?.totalElements || bookClubs?.content?.length || 0;
        } catch (bcError) {
            console.error("Erro ao buscar total de clubes de leitura:", bcError);
        }

        const counts = {
            'redacoes': data.essayCount || 0,
            'cordeis': data.cordelCount || 0,
            'contos': data.taleCount || 0,
            'cronicas': data.shortStoryCount || 0,
            'poemas': data.poemCount || 0,
            'jornal': data.articleCount || 0,
            'infograficos': data.infographicCount || 0,
            'artes': data.artCount || 0,
            'videos': data.multimediaCount || 0,
            'libras': data.libraLiteratureCount || 0,
            'clube-leitura': bookClubTotal 
        };

        const updatedCategories = initialCategories.map(cat => ({
          ...cat,
          count: counts[cat.id] || 0
        }));

        setCategories(updatedCategories);
      } catch (error) {
        console.error("Erro ao buscar as contagens das seções:", error);
      }
    }

    fetchCounts();
  }, []);

  return (
      <section className="sections">
        <h2>Seções da Biblioteca</h2>
        <span className="title-line" />
        <p className="sections-description">
          Explore as diversas produções autorais dos nossos estudantes
        </p>
        <div className="grid">
          {categories.map((category) => (
              <Link to={`/categoria/${category.id}`} key={category.id} className="card">
                <div className={`icon ${category.color}`}>
                  {category.icon}
                </div>
                <h3>{category.title}</h3>
                <span>{category.count} {category.count === 1 ? 'item' : 'itens'}</span>
              </Link>
          ))}
        </div>
      </section>
  );
}