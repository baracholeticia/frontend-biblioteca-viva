import { Link } from 'react-router-dom';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import '../login/Login.css'; 
export function Register() {
  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <section className="auth-container">
        <div className="auth-card">
          <h2>Criar Conta</h2>
          <p className="auth-subtitle">Junte-se à comunidade da Biblioteca Viva!</p>

          <form>
            <div className="input-group">
              <label htmlFor="nome">Nome Completo</label>
              <input type="text" id="nome" placeholder="Digite seu nome completo" />
            </div>

            <div className="input-group">
              <label htmlFor="email">E-mail</label>
              <input type="email" id="email" placeholder="Digite seu e-mail" />
            </div>

            <div className="input-group">
              <label htmlFor="senha-cadastro">Senha</label>
              <input type="password" id="senha-cadastro" placeholder="Crie uma senha" />
            </div>

            <button type="button" className="auth-btn">CADASTRAR</button>
          </form>

          <Link to="/login" className="auth-link">
            Já tem uma conta? <span>Faça login aqui</span>
          </Link>
        </div>
      </section>

      <Footer />
    </main>
  );
}