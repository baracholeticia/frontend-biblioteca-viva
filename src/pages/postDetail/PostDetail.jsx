import { useState } from "react";
import { Header } from "../../components/header/Header";
import { Footer } from "../../components/footer/Footer";
import "./PostDetail.css";

//mock data
const post = {
    id: 1,
    category: "Redações Nota 10",
    title: "Demo de Redação Nota 10",
    author: "Maria Silva",
    date: "03/03/2026",
    content:
     `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.`,
    initialLikes: 10,
    initialComments: [
        {id: 1, author: "João Pereira", text: "Excelente redação! Muito inspiradora."},
        {id: 2, author: "Ana Costa", text: "Gostei muito👏👏👏"}
    ]
};

export function PostDetail() {
    const [likes, setLikes] = useState(post.initialLikes);
    const [hasLiked, setHasLiked] = useState(false);
    const [comments, setComments] = useState(post.initialComments);
    const [newComment, setNewComment] = useState("");

    //dar like ou tirar like
    const handleLike = () => {
        if (hasLiked) {
            setLikes(likes - 1);
            setHasLiked(false);
        } else {
            setLikes(likes + 1);
            setHasLiked(true);
        }
    };

    //adicionar comentário
    const handleAddComment = (e) => {
        e.preventDefault();
        if (newComment.trim() === "") return;

        const newCommentObj = {
            id: Date.now(), // id único baseado no timestamp
            author: "Aluno",
            text: newComment
        };

        setComments([...comments, newCommentObj]);
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
                    <div className="post-body">
                        {post.content}
                    </div>

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