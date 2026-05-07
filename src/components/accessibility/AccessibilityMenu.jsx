import { useState, useEffect } from 'react';
import './AccessibilityMenu.css';

// Ícone Universal de Acessibilidade
// Ícone Internacional de Acessibilidade da Web (Com os pontos nas extremidades)
const IconAccessibility = () => (
  <svg id="Layer_1" data-name="Layer 1" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 122.88 122.88"><title>accessibility</title><path d="M61.44,0A61.46,61.46,0,1,1,18,18,61.21,61.21,0,0,1,61.44,0Zm-.39,74.18L52.1,98.91a4.94,4.94,0,0,1-2.58,2.83A5,5,0,0,1,42.7,95.5l6.24-17.28a26.3,26.3,0,0,0,1.17-4,40.64,40.64,0,0,0,.54-4.18c.24-2.53.41-5.27.54-7.9s.22-5.18.29-7.29c.09-2.63-.62-2.8-2.73-3.3l-.44-.1-18-3.39A5,5,0,0,1,27.08,46a5,5,0,0,1,5.05-7.74l19.34,3.63c.77.07,1.52.16,2.31.25a57.64,57.64,0,0,0,7.18.53A81.13,81.13,0,0,0,69.9,42c.9-.1,1.75-.21,2.6-.29l18.25-3.42A5,5,0,0,1,94.5,39a5,5,0,0,1,1.3,7,5,5,0,0,1-3.21,2.09L75.15,51.37c-.58.13-1.1.22-1.56.29-1.82.31-2.72.47-2.61,3.06.08,1.89.31,4.15.61,6.51.35,2.77.81,5.71,1.29,8.4.31,1.77.6,3.19,1,4.55s.79,2.75,1.39,4.42l6.11,16.9a5,5,0,0,1-6.82,6.24,4.94,4.94,0,0,1-2.58-2.83L63,74.23,62,72.4l-1,1.78Zm.39-53.52a8.83,8.83,0,1,1-6.24,2.59,8.79,8.79,0,0,1,6.24-2.59Zm36.35,4.43a51.42,51.42,0,1,0,15,36.35,51.27,51.27,0,0,0-15-36.35Z"/></svg>
);

// Ícone de Lâmpada (para o Alto Contraste)
const IconLamp = ({ filled }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.9 1.3 1.5 1.5 2.5" />
    <path d="M9 18h6" />
    <path d="M10 22h4" />
  </svg>
);

export function AccessibilityMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1); // Escala de Zoom (1 = 100%)

  // Aplica o alto contraste
  useEffect(() => {
    if (highContrast) {
      document.body.classList.add('high-contrast');
    } else {
      document.body.classList.remove('high-contrast');
    }
  }, [highContrast]);

  // Aplica o Zoom agressivo para aumentar/diminuir o site todo
  useEffect(() => {
    // Usa 'zoom' para navegadores webkit e transform para compatibilidade
    document.body.style.zoom = zoomLevel;
    // Fallback para Firefox (caso o zoom não funcione tão bem)
    document.body.style.MozTransform = `scale(${zoomLevel})`;
    document.body.style.MozTransformOrigin = "top left";
  }, [zoomLevel]);

  const increaseFont = () => setZoomLevel(prev => Math.min(prev + 0.05, 1.2)); // Max 120%
  const decreaseFont = () => setZoomLevel(prev => Math.max(prev - 0.05, 0.9)); // Min 90%
  const resetFont = () => setZoomLevel(1);

  return (
    <div className="a11y-container">
      <button 
        className={`a11y-toggle ${isOpen ? 'active' : ''}`} 
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Menu de Acessibilidade"
        title="Opções de Acessibilidade"
      >
        <IconAccessibility />
      </button>

      {isOpen && (
        <div className="a11y-menu">
          <div className="a11y-menu-header">
            <h3>Acessibilidade</h3>
            <button onClick={() => setIsOpen(false)} aria-label="Fechar menu">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
            </button>
          </div>
          
          <div className="a11y-options">
            <button 
              onClick={() => setHighContrast(!highContrast)} 
              className={`a11y-contrast-btn ${highContrast ? 'active' : ''}`}
            >
              <IconLamp filled={highContrast} />
              {highContrast ? 'Desativar Alto Contraste' : 'Ativar Alto Contraste'}
            </button>
            
            <div className="a11y-font-controls">
              <button onClick={decreaseFont} aria-label="Diminuir tamanho da tela">A-</button>
              <button onClick={resetFont} aria-label="Tamanho original da tela">A</button>
              <button onClick={increaseFont} aria-label="Aumentar tamanho da tela">A+</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}