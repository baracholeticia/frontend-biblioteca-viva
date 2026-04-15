import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { register } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import '../login/Login.css'; 

export function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { showToast } = useToast();

  async function handleRegister(e) {
    e.preventDefault(); 
    setLoading(true);
    try {
      await register(name, email, password);
      showToast('Cadastro realizado! Conta enviada para aprovação da administração.', 'success');
      navigate('/login');
    } catch (err) {
      console.error("Erro no cadastro:", err);
      showToast('Erro ao cadastrar. Verifique os dados ou se o e-mail já existe.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      
      <section className="auth-container">
        <div className="auth-card">
          <h2>Criar Conta</h2>
          <p className="auth-subtitle">Junte-se à comunidade da Biblioteca Viva!</p>

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label htmlFor="nome">Nome Completo</label>
              <input 
                type="text" 
                id="nome" 
                placeholder="Digite seu nome completo"
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
            </div>

            <div className="input-group">
              <label htmlFor="email">E-mail</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Digite seu e-mail"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="input-group">
              <label htmlFor="senha-cadastro">Senha</label>
              <input 
                type="password" 
                id="senha-cadastro" 
                placeholder="Crie uma senha"
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? 'CADASTRANDO...' : 'CADASTRAR'}
            </button>
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