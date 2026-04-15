import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { categories as initialCategories } from '../../data/categories';
import { getAllWorks } from '../../services/workService';
import './Sections.css';

const typeToCategoryId = {
  'Essay': 'redacoes', 
  'Cordel': 'cordeis', 
  'Tale': 'contos', 
  'ShortStory': 'cronicas',
  'Article': 'jornal', 
  'Infographic': 'infograficos', 
  'Art': 'artes', 
  'Multimedia': 'videos', 
  'LibraLiterature': 'libras'
};

export function Sections() {
  const [categories, setCategories] = useState(initialCategories);

  useEffect(() => {
    async function fetchCounts() {
      try {
        const allWorks = await getAllWorks();
        
        const counts = {};
        
        initialCategories.forEach(cat => counts[cat.id] = 0);

        allWorks.forEach(work => {
          const categoryId = typeToCategoryId[work.type];
          if (categoryId) {
            counts[categoryId] = (counts[categoryId] || 0) + 1;
          }
        });

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
          <Link
            to={`/categoria/${category.id}`}
            key={category.id}
            className="card"
          >
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