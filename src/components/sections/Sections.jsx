import { Link } from 'react-router-dom';
import { categories } from '../../data/categories';
import './Sections.css';

export function Sections() {
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
            <span>{category.count} itens</span>
          </Link>
        ))}
      </div>
    </section>
  );
}