import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    getNextBookClub,
    subscribeToBookClub,
    unsubscribeFromBookClub,
    getBookClubReviews,
    createBookClubReview
} from '../../services/bookclubService';
import { isLoggedIn } from '../../services/authService';
import { IconBookmark, IconCalendar, IconMapPin, IconCheck, IconUser, IconStar, IconMessage } from '../icons';
import './ClubeLeitura.css';

function getUserKey() {
    try {
        const token = localStorage.getItem('token');
        if (!token) return null;
        const payload = JSON.parse(atob(token.split('.')[1]));
        return (payload.sub || payload.email || payload.username || '').toLowerCase();
    } catch { return null; }
}

function getSubscriptionKey(clubId) {
    const userKey = getUserKey();
    if (!userKey || !clubId) return null;
    return `bc_subscribed_${clubId}_${userKey}`;
}

function loadSubscriptionState(clubId) {
    const key = getSubscriptionKey(clubId);
    if (!key) return false;
    return localStorage.getItem(key) === 'true';
}

function saveSubscriptionState(clubId, value) {
    const key = getSubscriptionKey(clubId);
    if (!key) return;
    if (value) {
        localStorage.setItem(key, 'true');
    } else {
        localStorage.removeItem(key);
    }
}

export function ClubeLeitura() {
    const [nextMeeting, setNextMeeting] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [confirmado, setConfirmado] = useState(false);
    const [loading, setLoading] = useState(true);
    const [mensagem, setMensagem] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const navigate = useNavigate();

    const [filterRating, setFilterRating] = useState(0);
    const [newReviewContent, setNewReviewContent] = useState('');
    const [newReviewRating, setNewReviewRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        async function fetchBookClub() {
            try {
                const data = await getNextBookClub();
                setNextMeeting(data);

                if (data && data.id) {
                    const reviewsData = await getBookClubReviews(data.id);
                    setReviews(reviewsData.content || []);

                    // Restaura estado de inscrição do localStorage vinculado ao usuário
                    if (isLoggedIn()) {
                        const savedState = loadSubscriptionState(data.id);
                        setConfirmado(savedState);
                    }
                }
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
            setMensagem('Você precisa estar logado para confirmar presença.');
            setTimeout(() => navigate('/login'), 1500);
            return;
        }

        if (!nextMeeting || isProcessing) return;

        setIsProcessing(true);
        setMensagem('');

        try {
            if (confirmado) {
                await unsubscribeFromBookClub(nextMeeting.id);
                setConfirmado(false);
                saveSubscriptionState(nextMeeting.id, false);
                setNextMeeting(prev => ({
                    ...prev,
                    participantsCount: Math.max(0, (prev.participantsCount || 1) - 1)
                }));
            } else {
                try {
                    await subscribeToBookClub(nextMeeting.id);
                    setConfirmado(true);
                    saveSubscriptionState(nextMeeting.id, true);
                    setNextMeeting(prev => ({
                        ...prev,
                        participantsCount: (prev.participantsCount || 0) + 1
                    }));
                } catch (subError) {
                    if (subError?.response?.status === 409) {
                        setConfirmado(true);
                        saveSubscriptionState(nextMeeting.id, true);
                    } else {
                        throw subError;
                    }
                }
            }
        } catch (error) {
            console.error("Erro ao confirmar presença:", error);
            if (error?.response?.status === 404 || error?.response?.status === 400) {
                setConfirmado(false);
                saveSubscriptionState(nextMeeting.id, false);
            } else {
                setMensagem('Erro ao processar sua inscrição. Tente novamente.');
            }
        } finally {
            setIsProcessing(false);
        }
    };

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!isLoggedIn()) {
            alert('Faça login para deixar sua avaliação.');
            navigate('/login');
            return;
        }
        if (newReviewRating === 0) {
            alert('Selecione uma nota de 0.5 a 5 estrelas.');
            return;
        }

        setSubmitting(true);
        try {
            const addedReview = await createBookClubReview(nextMeeting.id, {
                content: newReviewContent,
                rating: newReviewRating
            });

            setReviews([addedReview, ...reviews]);
            setNewReviewContent('');
            setNewReviewRating(0);
            setHoverRating(0);
        } catch (error) {
            console.error("Erro ao enviar avaliação:", error);
            alert('Não foi possível enviar sua avaliação. Verifique se o texto atende aos limites.');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (isoDate) => {
        if (!isoDate) return '';
        const date = new Date(isoDate);
        return date.toLocaleString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' });
    };

    const filteredReviews = filterRating === 0
        ? reviews
        : reviews.filter(r => Number(r.rating) === filterRating);

    // Limita a exibição às 3 avaliações mais recentes (considerando o filtro ativo)
    const displayedReviews = [...filteredReviews]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 3);

    if (loading) return null;

    const filterOptions = [5, 4.5, 4, 3.5, 3, 2.5, 2, 1.5, 1, 0.5];

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
                    <>
                        <div className="cl-main-grid">

                            <Link
                                to={`/clube-leitura/${nextMeeting.id}`}
                                className="cl-book-card cl-book-card--clickable"
                            >
                                <div className="cl-book-card__header">
                                    <span className="cl-book-card__header-icon"><IconBookmark size={22} color="#ffffff" /></span>
                                    <h2 className="cl-book-card__header-title">Livro do Mês</h2>
                                </div>

                                <div className="cl-book-card__content">
                                    {nextMeeting.bookCoverUrl && (
                                        <div className="cl-book-card__image-wrapper">
                                            <img
                                                src={nextMeeting.bookCoverUrl}
                                                alt={nextMeeting.bookName}
                                                className="cl-book-card__image"
                                            />
                                        </div>
                                    )}
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
                            </Link>

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

                                {mensagem && (
                                    <p style={{
                                        color: '#d93025',
                                        fontSize: '0.875rem',
                                        textAlign: 'center',
                                        marginBottom: '8px',
                                        fontWeight: 500
                                    }}>
                                        {mensagem}
                                    </p>
                                )}

                                <button
                                    className={`cl-meeting-card__btn ${confirmado ? 'cl-meeting-card__btn--confirmed' : ''}`}
                                    onClick={handleSubscribeToggle}
                                    disabled={isProcessing}
                                >
                                    {isProcessing
                                        ? 'Aguarde...'
                                        : confirmado
                                            ? <><IconCheck size={16} /> Presença Confirmada!</>
                                            : 'Confirmar Presença'
                                    }
                                </button>
                            </div>
                        </div>

                        <div className="cl-reviews-section" style={{ marginTop: '48px' }}>
                            <div className="cl-reviews__header">
                                <span className="cl-reviews__icon"><IconMessage size={24} color="#1a2f5e" /></span>
                                <h3 className="cl-reviews__title">Comentários e Avaliações</h3>
                            </div>

                            <form className="cl-review-form" onSubmit={handleReviewSubmit}>
                                <div className="cl-review-form__stars-row">
                                    <span className="cl-review-form__label">Sua nota:</span>

                                    <div className="cl-stars-interactive-container">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const currentVal = hoverRating || newReviewRating;
                                            const ratio = currentVal >= star ? 1 : currentVal >= star - 0.5 ? 0.5 : 0;
                                            const color = currentVal >= star - 0.5 ? '#f5a623' : '#ccc';

                                            return (
                                                <div key={star} className="cl-star-interactive">
                                                    <IconStar size={26} fillRatio={ratio} color={color} />
                                                    <div
                                                        className="cl-star-half cl-star-half--left"
                                                        onMouseEnter={() => setHoverRating(star - 0.5)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        onClick={() => setNewReviewRating(star - 0.5)}
                                                    />
                                                    <div
                                                        className="cl-star-half cl-star-half--right"
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        onClick={() => setNewReviewRating(star)}
                                                    />
                                                </div>
                                            );
                                        })}
                                    </div>

                                    <span className="cl-review-form__rating-value">
                                        {(hoverRating || newReviewRating) > 0 ? (hoverRating || newReviewRating).toFixed(1) : ''}
                                    </span>
                                </div>

                                <div className="cl-review-form__input-group">
                                    <textarea
                                        className="cl-review-form__textarea"
                                        placeholder="Escreva sua resenha ou comentário sobre o livro..."
                                        value={newReviewContent}
                                        onChange={(e) => setNewReviewContent(e.target.value)}
                                        maxLength={200}
                                    />
                                    <button
                                        type="submit"
                                        className="cl-review-form__submit"
                                        disabled={submitting || newReviewContent.trim() === '' || newReviewRating === 0}
                                    >
                                        {submitting ? 'Enviando...' : 'Avaliar'}
                                    </button>
                                </div>
                            </form>

                            {reviews.length > 0 && (
                                <div className="cl-reviews-filter">
                                    <button
                                        className={`cl-filter-btn ${filterRating === 0 ? 'active' : ''}`}
                                        onClick={() => setFilterRating(0)}
                                    >
                                        Todas
                                    </button>
                                    {filterOptions.map(num => (
                                        <button
                                            key={num}
                                            className={`cl-filter-btn ${filterRating === num ? 'active' : ''}`}
                                            onClick={() => setFilterRating(num)}
                                        >
                                            {num} <IconStar size={12} fillRatio={1} color="currentColor" />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {displayedReviews.length > 0 ? (
                                <div className="cl-reviews-grid">
                                    {displayedReviews.map((review) => {
                                        const rating = Number(review.rating);
                                        return (
                                            <div key={review.id} className="cl-review-card">
                                                <div className="cl-review-card__top">
                                                    <div>
                                                        <p className="cl-review-card__name">{review.authorName}</p>
                                                        <p className="cl-review-card__turma">{formatDate(review.createdAt)}</p>
                                                    </div>
                                                    <div className="cl-review-card__stars">
                                                        {[1, 2, 3, 4, 5].map((star) => {
                                                            const ratio = rating >= star ? 1 : rating >= star - 0.5 ? 0.5 : 0;
                                                            return (
                                                                <IconStar
                                                                    key={star}
                                                                    size={14}
                                                                    fillRatio={ratio}
                                                                    color={rating >= star - 0.5 ? '#f5a623' : '#eee'}
                                                                />
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                                <p className="cl-review-card__text">"{review.content}"</p>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <p className="cl-reviews__empty">Nenhuma avaliação encontrada com esta nota.</p>
                            )}

                            {filteredReviews.length > 3 && (
                                <div className="cl-reviews__more-wrapper">
                                    <Link
                                        to={`/clube-leitura/${nextMeeting.id}`}
                                        className="cl-reviews__more-link"
                                    >
                                        Ver todas as {filteredReviews.length} avaliações
                                    </Link>
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div style={{ textAlign: 'center', padding: '40px', background: '#fff', borderRadius: 16 }}>
                        <p style={{ color: '#666' }}>Nenhum encontro agendado no momento. Fique de olho!</p>
                    </div>
                )}
            </div>
        </section>
    );
}