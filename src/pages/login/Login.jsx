import { Link } from 'react-router-dom';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import './Login.css';

export function Login() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <section className="auth-container">
        <div className="auth-card">
          <h2>Bem-vindo de volta!</h2>
          <p className="auth-subtitle">Acesse a sua conta da Biblioteca Viva!</p>

          <form>
            <div className="input-group">
              <label htmlFor="matricula">E-mail</label>
              <input type="text" id="matricula" placeholder="Digite seu e-mail" />
            </div>

            <div className="input-group">
              <label htmlFor="senha">Senha</label>
              <input type="password" id="senha" placeholder="Digite sua senha" />
            </div>

            <button type="button" className="auth-btn">ENTRAR</button>
          </form>

          <Link to="/cadastro" className="auth-link">
            Ainda não tem conta? <span>Cadastre-se aqui</span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}