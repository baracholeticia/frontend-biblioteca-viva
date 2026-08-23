import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../../components/header/Header';
import { Footer } from '../../components/footer/Footer';
import { requestPasswordReset, verifyPasswordResetCode, confirmPasswordReset } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import './Login.css';

export function ForgotPassword() {
  const [step, setStep] = useState(1); 
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { showToast } = useToast();

  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await requestPasswordReset(email);
      showToast('Código enviado para o seu e-mail.', 'success');
      setStep(2);
    } catch (error) {
      showToast('Erro ao solicitar código. Verifique se o e-mail está correto.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await verifyPasswordResetCode(email, code);
      setResetToken(response.resetToken);
      showToast('Código validado com sucesso!', 'success');
      setStep(3);
    } catch (error) {
      showToast('Código inválido ou expirado.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await confirmPasswordReset(resetToken, newPassword);
      showToast('Senha redefinida com sucesso!', 'success');
      navigate('/login');
    } catch (error) {
      showToast('Erro ao redefinir a senha.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <section className="auth-container">
        <div className="auth-card">
          <h2>Recuperar Senha</h2>
          
          {step === 1 && (
            <>
              <p className="auth-subtitle">Informe seu e-mail para receber o código.</p>
              <form onSubmit={handleRequestCode}>
                <div className="input-group">
                  <label htmlFor="email">E-mail</label>
                  <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Enviando...' : 'ENVIAR CÓDIGO'}</button>
              </form>
            </>
          )}

          {step === 2 && (
            <>
              <p className="auth-subtitle">Digite o código de 8 dígitos enviado para {email}</p>
              <form onSubmit={handleVerifyCode}>
                <div className="input-group">
                  <label htmlFor="code">Código de Verificação</label>
                  <input type="text" id="code" value={code} onChange={(e) => setCode(e.target.value)} required maxLength={8} />
                </div>
                <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Verificando...' : 'VALIDAR CÓDIGO'}</button>
              </form>
            </>
          )}

          {step === 3 && (
            <>
              <p className="auth-subtitle">Crie sua nova senha.</p>
              <form onSubmit={handleResetPassword}>
                <div className="input-group">
                  <label htmlFor="newPassword">Nova Senha</label>
                  <input type="password" id="newPassword" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} />
                </div>
                <button type="submit" className="auth-btn" disabled={loading}>{loading ? 'Salvando...' : 'REDEFINIR SENHA'}</button>
              </form>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}