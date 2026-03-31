import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import { getPostById } from "../../data/posts";
import "./PostDetail.css";

export function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const post = getPostById(id);

  const [likes, setLikes] = useState(post?.initialLikes ?? 0);
  const [hasLiked, setHasLiked] = useState(false);
  const [comments, setComments] = useState(post?.initialComments ?? []);
  const [newComment, setNewComment] = useState("");

  if (!post) {
    return (
      <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <section style={{ flex: 1, padding: '80px 20px', textAlign: 'center', color: '#0a2a57' }}>
          <h1>Post não encontrado</h1>
          <button onClick={() => navigate(-1)} style={{ marginTop: 20, cursor: 'pointer' }}>Voltar</button>
        </section>
        <Footer />
      </main>
    );
  }

  const handleLike = () => {
    if (hasLiked) {
      setLikes(likes - 1);
      setHasLiked(false);
    } else {
      setLikes(likes + 1);
      setHasLiked(true);
    }
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim() === "") return;
    setComments([...comments, {
      id: Date.now(),
      author: "Aluno",
      text: newComment
    }]);
    setNewComment("");
  };

  return (
    <main style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header />
      <section className="post-container">
        <article className="post-content">
          <div className="post-header">
            <span className="post-category">{post.category}</span>
            <h1 className="post-title">{post.title}</h1>
            <span className="post-meta">Por {post.author} em {post.date}</span>
          </div>
          <div className="post-body">{post.content}</div>
          <div className="post-interactions">
            <button className={`like-btn ${hasLiked ? "liked" : ""}`} onClick={handleLike}>
              {hasLiked ? '❤️' : '🤍'} {likes} Curtidas
            </button>
            <span className="btn-interact">
              💬 {comments.length} Comentários
            </span>
          </div>
        </article>

        <section className="comments-section">
          <h2>Comentários</h2>
          <div className="comment-list">
            {comments.map((comment) => (
              <div key={comment.id} className="comment-item">
                <div className="comment-author">{comment.author}</div>
                <div className="comment-text">{comment.text}</div>
              </div>
            ))}
          </div>
          <form className="comment-form" onSubmit={handleAddComment}>
            <textarea
              placeholder="Escreva um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button type="submit" className="comment-submit-btn">Enviar Comentário</button>
          </form>
        </section>
      </section>
      <Footer />
    </main>
  );
}

