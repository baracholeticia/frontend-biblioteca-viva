/* eslint-disable react-refresh/only-export-components */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllWorks } from '../../services/workService';
import { IconBarChart, IconPalette, IconVideo, IconHand } from '../icons';
import './Multimidia.css';

export function getYoutubeThumbnail(url) {
  if (!url) return null;
  const match = url?.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/
  );
  if (!match) return null;
  return `https://img.youtube.com/vi/${match[1]}/maxresdefault.jpg`;
}

export function formatDuration(durationInfo) {
  if (!durationInfo) return '';
  
  if (typeof durationInfo === 'string' && durationInfo.includes(':') && !durationInfo.startsWith('PT')) {
    return durationInfo;
  }

  if (typeof durationInfo === 'object' && durationInfo.seconds !== undefined) {
    const m = Math.floor(durationInfo.seconds / 60).toString().padStart(2, '0');
    const s = (durationInfo.seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
  
  if (typeof durationInfo === 'string' && durationInfo.startsWith('PT')) {
    const minMatch = durationInfo.match(/(\d+)M/);
    const secMatch = durationInfo.match(/(\d+)S/);
    
    const m = minMatch ? minMatch[1].padStart(2, '0') : '00';
    const s = secMatch ? secMatch[1].padStart(2, '0') : '00';
    return `${m}:${s}`;
  }
  return String(durationInfo);
}

export function Multimidia() {
  const [infograficos, setInfograficos] = useState([]);
  const [artes, setArtes] = useState([]);
  const [videos, setVideos] = useState([]);
  const [libras, setLibras] = useState([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const [infoData, artesData, videosData, librasData] = await Promise.all([
          getAllWorks('Infographic'),
          getAllWorks('Art'),
          getAllWorks('Multimedia'),
          getAllWorks('LibraLiterature')
        ]);
        setInfograficos(infoData.slice(0, 3));
        setArtes(artesData.slice(0, 4));
        setVideos(videosData.slice(0, 3));
        setLibras(librasData.slice(0, 3));
      } catch (error) {
        console.error("Erro ao buscar Multimídia:", error);
      }
    }
    fetchData();
  }, []);

  if (!infograficos.length && !artes.length && !videos.length && !libras.length) return null;

  return (
    <section className="mv-section">
      <div className="mv-container">

        <div className="mv-hero">
          <h1 className="mv-hero__title">Multimídia e Criações Visuais</h1>
          <p className="mv-hero__subtitle">Infográficos, artes, vídeos e literatura em Libras</p>
        </div>

        {/* Infográficos */}
        {infograficos.length > 0 && (
          <div className="mv-grid-column">
            <div className="mv-category__header">
              <div className="mv-category__title-wrapper">
                <span className="mv-category__icon"><IconBarChart size={22} color="#d93025" /></span>
                <h2 className="mv-category__name">Infográficos em Foco</h2>
              </div>
              <Link to="/categoria/infograficos" className="mv-category__link">Ver todos →</Link>
            </div>
            <div className="mv-grid mv-grid--3 mv-mb">
              {infograficos.map((item) => (
                <Link to={`/infograficos/${item.id}`} className="mv-card" key={item.id} style={{ textDecoration: 'none' }}>
                  <div className="mv-card__preview">
                    {item.url
                      ? <img src={item.url} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={(e) => { e.target.style.display = 'none' }} />
                      : <IconBarChart size={60} color="#ffffff" />
                    }
                  </div>
                  <div className="mv-card__info">
                    <p className="mv-card__title">{item.title}</p>
                    <p className="mv-card__author">Criado por {item.author}</p>
                    <p className="mv-card__turma">{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {artes.length > 0 && (
          <div className="mv-grid-column">
            <div className="mv-category__header">
              <div className="mv-category__title-wrapper">
                <span className="mv-category__icon"><IconPalette size={22} color="#d93025" /></span>
                <h2 className="mv-category__name">Galeria de Artes</h2>
              </div>
              <Link to="/categoria/artes" className="mv-category__link">Ver todas →</Link>
            </div>
            <div className="mv-grid mv-grid--4 mv-mb">
              {artes.map((item) => (
                <Link to={`/artes/${item.id}`} className="mv-arte-card" key={item.id} style={{ textDecoration: 'none' }}>
                  {item.url
                    ? <img src={item.url} alt={item.title} className="mv-arte-card__image" onError={(e) => { e.target.style.display = 'none' }} />
                    : <div className="mv-arte-card__image" style={{ background: '#1a2f5e' }} />
                  }
                  <p className="mv-arte-card__title">{item.title}</p>
                  <p className="mv-arte-card__author">{item.author}</p>
                </Link>
              ))}
            </div>
          </div>
        )}

        <div className="mv-grid mv-grid--2">
          {/* Vídeos Autorais */}
          {videos.length > 0 && (
            <div className="mv-grid-column">
              <div className="mv-category__header">
                <div className="mv-category__title-wrapper">
                  <span className="mv-category__icon"><IconVideo size={22} color="#d93025" /></span>
                  <h2 className="mv-category__name">Curtas e Vídeos</h2>
                </div>
                <Link to="/categoria/videos" className="mv-category__link">Ver todos →</Link>
              </div>
              <div className="mv-list">
                {videos.map((item) => {
                  const thumbnail = getYoutubeThumbnail(item.url);
                  return (
                    <Link to={`/videos/${item.id}`} className="mv-list-item" key={item.id} style={{ textDecoration: 'none' }}>
                      {thumbnail
                        ? <img src={thumbnail} alt={item.title} className="mv-list-item__thumb" onError={(e) => { e.target.style.display = 'none' }} />
                        : <div className="mv-list-item__icon mv-list-item__icon--red"><IconVideo size={24} color="#fff" /></div>
                      }
                      <div className="mv-list-item__info">
                        <p className="mv-list-item__title">{item.title}</p>
                        <p className="mv-list-item__sub">{item.author}</p>
                        {item.duration && <span className="mv-list-item__badge">{formatDuration(item.duration)}</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {libras.length > 0 && (
            <div className="mv-grid-column">
              <div className="mv-category__header">
                <div className="mv-category__title-wrapper">
                  <span className="mv-category__icon"><IconHand size={22} color="#d93025" /></span>
                  <h2 className="mv-category__name">Literatura em Libras</h2>
                </div>
                <Link to="/categoria/libras" className="mv-category__link">Ver todas →</Link>
              </div>
              <div className="mv-list">
                {libras.map((item) => {
                  const thumbnail = getYoutubeThumbnail(item.url);
                  return (
                    <Link to={`/libras/${item.id}`} className="mv-list-item" key={item.id} style={{ textDecoration: 'none' }}>
                      {thumbnail
                        ? <img src={thumbnail} alt={item.title} className="mv-list-item__thumb" onError={(e) => { e.target.style.display = 'none' }} />
                        : <div className="mv-list-item__icon mv-list-item__icon--navy"><IconHand size={24} color="#fff" /></div>
                      }
                      <div className="mv-list-item__info">
                        <p className="mv-list-item__title">{item.title}</p>
                        <p className="mv-list-item__sub">Interpretado por {item.author}</p>
                        {item.duration && <span className="mv-list-item__badge">{formatDuration(item.duration)}</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}