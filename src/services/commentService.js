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

export async function getReplies(workId, commentId) {
    try {
        const response = await api.get(`/work/${workId}/comments/${commentId}/reply`);
        const data = response.data;

        // O endpoint retorna o objeto da resposta diretamente (não paginado).
        // "content" aqui é o TEXTO da resposta (string), não uma lista de itens.
        // Se não houver "content" (texto) válido, consideramos que não há resposta.
        if (!data || !data.content) return null;

        return data;
    } catch {
        return null;
    }
}

export async function createReply(workId, commentId, content, authorName, isAdminUser) {
    const response = await api.post(`/work/${workId}/comments/${commentId}/reply`, { content });
    const responseData = response.data;
    responseData.isAdmin = !!isAdminUser;
    return responseData;
}

export async function updateReply(workId, commentId, content) {
    const response = await api.put(`/work/${workId}/comments/${commentId}/reply`, { content });
    return response.data;
}

export async function deleteReply(workId, commentId, replyId) {
    await api.delete(`/work/${workId}/comments/${commentId}/reply/${replyId}`);
}