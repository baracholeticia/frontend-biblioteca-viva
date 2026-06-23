import api from './api';

export async function getComments(workId, page = 0, size = 10) {
    const response = await api.get(`/work/${workId}/comments?page=${page}&size=${size}`);
    
    if (response.data) {
        if (response.data.content) {
            return response.data.content;
        } else {
            return [];
        }
    } else {
        return [];
    }
}

export async function createComment(workId, content) {
    const response = await api.post(`/work/${workId}/comments`, { content });
    return response.data;
}

export async function updateComment(workId, commentId, content) {
    const response = await api.put(`/work/${workId}/comments/${commentId}`, { content });
    return response.data;
}

export async function deleteComment(workId, commentId) {
    await api.delete(`/work/${workId}/comments/${commentId}`);
}

export async function likeComment(workId, commentId) {
    await api.put(`/work/${workId}/comments/${commentId}/like`);
}

export async function unlikeComment(workId, commentId) {
    await api.delete(`/work/${workId}/comments/${commentId}/like`);
}

// ==========================================
// Lógica de Respostas (Replies)
// ==========================================

const REPLIES_KEY = (workId) => `post_replies_${workId}`;

function loadLocalReplies(workId) {
    try {
        const stored = localStorage.getItem(REPLIES_KEY(workId));
        if (stored) {
            return JSON.parse(stored);
        } else {
            return {};
        }
    } catch (error) { 
        return {error};
    }
}

function saveLocalReplies(workId, data) {
    localStorage.setItem(REPLIES_KEY(workId), JSON.stringify(data));
}

export async function getReplies(workId, commentId) {
    try {
        const response = await api.get(`/work/${workId}/comments/${commentId}/reply`);
        // Se a resposta vier dentro de .content ou direto no .data
        return response.data?.content || response.data || null;
    } catch (error) {
        // Se der 404, significa apenas que não há resposta vinculada. Retornamos nulo.
        if (error.response && error.response.status === 404) {
            return null;
        }
        return null; // Para outros erros, garantimos que não retorne algo que quebre a tela
    }
}

export async function createReply(workId, commentId, content, authorName, isAdminUser) {
    let isAdmin = false;
    if (isAdminUser) {
        isAdmin = true;
    }

    try {
        // Corrigido para /reply no singular conforme o OpenAPI
        const response = await api.post(`/work/${workId}/comments/${commentId}/reply`, { content });
        let responseData = response.data;
        responseData.isAdmin = isAdmin;
        
        return responseData;
    } catch (error) {
        const all = loadLocalReplies(workId);
        let list = [];
        
        if (all[commentId]) {
            list = all[commentId];
        }

        let finalAuthorName = 'Autor';
        if (authorName) {
            finalAuthorName = authorName;
        }

        const newReply = {
            id: `local_${Date.now()}`,
            content: content,
            authorName: finalAuthorName,
            createdAt: new Date().toISOString(),
            isAdmin: isAdmin,
        };

        list.push(newReply);
        all[commentId] = list;
        saveLocalReplies(workId, all);
        
        return newReply;
    }
}

export async function updateReply(workId, commentId, content) {
    const response = await api.put(`/work/${workId}/comments/${commentId}/reply`, { content });
    return response.data;
}

export async function deleteReply(workId, commentId, replyId) {
    await api.delete(`/work/${workId}/comments/${commentId}/reply/${replyId}`);
}