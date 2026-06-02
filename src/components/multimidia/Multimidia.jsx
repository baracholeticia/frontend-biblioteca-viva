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

// NOVA FUNÇÃO DE FORMATAÇÃO DE TEMPO
export function formatDuration(durationInfo) {
  if (!durationInfo) return '';
  
  // Se já vier formatado ou não for o padrão ISO (evita quebrar se algo mudar)
  if (typeof durationInfo === 'string' && durationInfo.includes(':') && !durationInfo.startsWith('PT')) {
    return durationInfo;
  }

  // Se o backend enviar como um objeto (Padrão do Java Duration em JSON)
  if (typeof durationInfo === 'object' && durationInfo.seconds !== undefined) {
    const m = Math.floor(durationInfo.seconds / 60).toString().padStart(2, '0');
    const s = (durationInfo.seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
  
  // Se o backend enviar a string no formato ISO (PT5M, PT6M18S, etc)
  if (typeof durationInfo === 'string' && durationInfo.startsWith('PT')) {
    const minMatch = durationInfo.match(/(\d+)M/);
    const secMatch = durationInfo.match(/(\d+)S/);
    
    // Pega os números encontrados ou coloca "00"
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
          <>
            <div className="mv-category__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="mv-category__icon"><IconBarChart size={22} color="#d93025" /></span>
                <h2 className="mv-category__name">Infográficos em Foco</h2>
              </div>
              <Link to="/categoria/infograficos" style={{ color: '#d93025', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>Ver todos →</Link>
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
          </>
        )}

        {/* Galeria de Artes */}
        {artes.length > 0 && (
          <>
            <div className="mv-category__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span className="mv-category__icon"><IconPalette size={22} color="#d93025" /></span>
                <h2 className="mv-category__name">Galeria de Artes</h2>
              </div>
              <Link to="/categoria/artes" style={{ color: '#d93025', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>Ver todas →</Link>
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
          </>
        )}

        <div className="mv-grid mv-grid--2">
          {/* Vídeos Autorais */}
          {videos.length > 0 && (
            <div>
              <div className="mv-category__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="mv-category__icon"><IconVideo size={22} color="#d93025" /></span>
                  <h2 className="mv-category__name">Curtas e Vídeos</h2>
                </div>
                <Link to="/categoria/videos" style={{ color: '#d93025', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>Ver todos →</Link>
              </div>
              <div className="mv-list">
                {videos.map((item) => {
                  const thumbnail = getYoutubeThumbnail(item.url);
                  return (
                    <Link to={`/videos/${item.id}`} className="mv-list-item" key={item.id} style={{ textDecoration: 'none' }}>
                      {thumbnail
                        ? <img src={thumbnail} alt={item.title} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} onError={(e) => { e.target.style.display = 'none' }} />
                        : <div className="mv-list-item__icon mv-list-item__icon--red"><IconVideo size={24} color="#fff" /></div>
                      }
                      <div className="mv-list-item__info">
                        <p className="mv-list-item__title">{item.title}</p>
                        <p className="mv-list-item__sub">{item.author}</p>
                        {/* AQUI ESTÁ A MÁGICA DA FORMATAÇÃO */}
                        {item.duration && <span className="mv-list-item__badge">{formatDuration(item.duration)}</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          )}

          {/* Literatura em Libras */}
          {libras.length > 0 && (
            <div>
              <div className="mv-category__header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span className="mv-category__icon"><IconHand size={22} color="#d93025" /></span>
                  <h2 className="mv-category__name">Literatura em Libras</h2>
                </div>
                <Link to="/categoria/libras" style={{ color: '#d93025', fontWeight: 600, fontSize: '0.95rem', textDecoration: 'none' }}>Ver todas →</Link>
              </div>
              <div className="mv-list">
                {libras.map((item) => {
                  const thumbnail = getYoutubeThumbnail(item.url);
                  return (
                    <Link to={`/libras/${item.id}`} className="mv-list-item" key={item.id} style={{ textDecoration: 'none' }}>
                      {thumbnail
                        ? <img src={thumbnail} alt={item.title} style={{ width: 56, height: 56, objectFit: 'cover', borderRadius: 10, flexShrink: 0 }} onError={(e) => { e.target.style.display = 'none' }} />
                        : <div className="mv-list-item__icon mv-list-item__icon--navy"><IconHand size={24} color="#fff" /></div>
                      }
                      <div className="mv-list-item__info">
                        <p className="mv-list-item__title">{item.title}</p>
                        <p className="mv-list-item__sub">Interpretado por {item.author}</p>
                        {/* AQUI ESTÁ A MÁGICA DA FORMATAÇÃO */}
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