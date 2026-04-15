import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getNextBookClub, subscribeToBookClub, unsubscribeFromBookClub } from '../../services/bookclubService';
import { isLoggedIn } from '../../services/authService';
import { IconBookmark, IconCalendar, IconMapPin, IconCheck, IconUser } from '../icons';
import './ClubeLeitura.css';

export function ClubeLeitura() {
  const [nextMeeting, setNextMeeting] = useState(null);
  const [confirmado, setConfirmado] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchBookClub() {
      try {
        const data = await getNextBookClub();
        setNextMeeting(data);
      } catch (error) {
        console.error("Erro ao buscar próximo clube do livro:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchBookClub();
  }, []);

  const handleSubscribeToggle = async () => {
    if (!isLoggedIn()) {
      alert("Você precisa estar logado para confirmar presença.");
      navigate('/login');
      return;
    }

    if (!nextMeeting) return;

    try {
      if (confirmado) {
        await unsubscribeFromBookClub(nextMeeting.id);
        setConfirmado(false);
        setNextMeeting(prev => ({ ...prev, participantsCount: prev.participantsCount - 1 }));
      } else {
        await subscribeToBookClub(nextMeeting.id);
        setConfirmado(true);
        setNextMeeting(prev => ({ ...prev, participantsCount: prev.participantsCount + 1 }));
      }
    } catch (error) {
      console.error("Erro ao confirmar presença:", error); // Correção aplicada aqui
      alert("Erro ao processar sua inscrição. Tente novamente.");
    }
  };

  const formatDate = (isoDate) => {
    if (!isoDate) return '';
    const date = new Date(isoDate);
    return date.toLocaleString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' });
  };

  if (loading) return null;

  return (
    <section className="cl-section">
      <div className="cl-container">

        <div className="cl-hero">
          <h1 className="cl-hero__title">
            <span className="cl-hero__title-icon"><IconBookmark size={28} color="#d93025" /></span>
            Clube de Leitura
          </h1>
          <p className="cl-hero__subtitle">Leia, discuta e compartilhe suas impressões sobre o livro do mês</p>
        </div>

        {nextMeeting ? (
          <div className="cl-main-grid">
            <div className="cl-book-card">
              <div className="cl-book-card__header">
                <span className="cl-book-card__header-icon"><IconBookmark size={22} color="#ffffff" /></span>
                <h2 className="cl-book-card__header-title">Livro do Mês</h2>
              </div>
              <div className="cl-book-card__content">
                <div className="cl-book-card__info">
                  <p className="cl-book-card__title">{nextMeeting.bookName}</p>
                  <p className="cl-book-card__author">por {nextMeeting.bookAuthor}</p>
                  <p className="cl-book-card__desc">{nextMeeting.bookSynopses}</p>
                  <div className="cl-book-card__participants">
                    <IconUser size={16} color="rgba(255,255,255,0.8)" />
                    <span>{nextMeeting.participantsCount} participantes confirmados</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="cl-meeting-card">
              <div className="cl-meeting-card__header">
                <span className="cl-meeting-card__header-icon"><IconCalendar size={22} color="#1a2f5e" /></span>
                <h2 className="cl-meeting-card__header-title">Próximo Encontro</h2>
              </div>

              <div className="cl-meeting-card__info-list">
                <div className="cl-meeting-card__info-item">
                  <span className="cl-meeting-card__info-icon"><IconCalendar size={20} color="#d93025" /></span>
                  <div>
                    <p className="cl-meeting-card__info-label">Data e Horário</p>
                    <p className="cl-meeting-card__info-value">{formatDate(nextMeeting.date)}</p>
                  </div>
                </div>
                <div className="cl-meeting-card__info-item">
                  <span className="cl-meeting-card__info-icon"><IconMapPin size={20} color="#d93025" /></span>
                  <div>
                    <p className="cl-meeting-card__info-label">Local</p>
                    <p className="cl-meeting-card__info-value">{nextMeeting.location}</p>
                  </div>
                </div>
              </div>

              <button 
                className="cl-meeting-card__btn" 
                onClick={handleSubscribeToggle}
                style={{ backgroundColor: confirmado ? '#16a34a' : '#d93025' }}
              >
                {confirmado ? (
                  <><IconCheck size={16} /> Presença Confirmada!</>
                ) : 'Confirmar Presença'}
              </button>
              <p className="cl-meeting-card__hint">Traga sua resenha ou prepare sua opinião sobre o livro!</p>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: 16 }}>
            <p style={{ color: '#666' }}>Nenhum encontro agendado no momento. Fique de olho!</p>
          </div>
        )}
      </div>
    </section>
  );
}