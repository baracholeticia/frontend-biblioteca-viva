import './Footer.css';
// Importando as logos para o footer
import logoPernambuco from '../../assets/logos/pernambuco.png';
import logoGre from '../../assets/logos/gre.png';

export function Footer() {
  return (
    <>
      <section className="invite">
        <h2>Faça Parte da Nossa Comunidade</h2>
        <p>Compartilhe suas produções culturais e inspire outros estudantes.</p>
      </section>

      <footer className="footer">
        <p><strong>BIBLIOTECA VIVA</strong></p>
        <p>EREM Abílio Monteiro, Lagoa do Ouro - PE</p>
        
        {/* Container das logos dos parceiros/governo */}
        <div className="footer-logos">
          <img src={logoPernambuco} alt="Logo Pernambuco" />
          <img src={logoGre} alt="Logo GRE" />
        </div>

        <p>© 2026 Biblioteca Viva</p>
      </footer>
    </>
  );
}