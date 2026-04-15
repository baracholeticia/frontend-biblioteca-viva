import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { login } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import './Login.css';

function getRoleFromToken(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.role || payload.authorities || payload.roles || '';
  } catch (error) {
    console.error("Erro ao decodificar token:", error);
    return '';
  }
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await login(email, password);
      showToast('Bem-vindo à Biblioteca Viva!', 'success');
      
      const role = getRoleFromToken(response.token);
      
      if (email === 'admin@admin.com' || role.includes('ADMIN') || role.includes('CURADOR')) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error("Erro no login:", error);
      
      const status = error.response ? error.response.status : null;
      
      if (status === 401) {
        showToast('E-mail ou senha inválidos.', 'error');
      } else if (status === 403) {
        showToast('Sua conta ainda está em análise pela administração. Aguarde a aprovação.', 'error');
      } else {
        showToast('Erro ao conectar com o servidor. Tente novamente mais tarde.', 'error');
      }
      
    } finally {
      setLoading(false);
    }
  }

  return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <section className="auth-container">
          <div className="auth-card">
            <h2>Bem-vindo de volta!</h2>
            <p className="auth-subtitle">Acesse a sua conta da Biblioteca Viva!</p>

            <form onSubmit={handleLogin}>
              <div className="input-group">
                <label htmlFor="email">E-mail</label>
                <input
                    type="email"
                    id="email"
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
              </div>

              <div className="input-group">
                <label htmlFor="senha">Senha</label>
                <input
                    type="password"
                    id="senha"
                    placeholder="Digite sua senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
              </div>

              <button type="submit" className="auth-btn" disabled={loading}>
                {loading ? 'ENTRANDO...' : 'ENTRAR'}
              </button>
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