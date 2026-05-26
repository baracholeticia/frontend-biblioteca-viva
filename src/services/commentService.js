import api from './api';

export async function getComments(workId) {
    const response = await api.get(`/work/${workId}/comments`);
    return response.data.content;
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



const REPLIES_KEY = (workId) => `post_replies_${workId}`;

function loadLocalReplies(workId) {
    try {
        return JSON.parse(localStorage.getItem(REPLIES_KEY(workId)) || '{}');
    } catch { return {}; }
}

function saveLocalReplies(workId, data) {
    localStorage.setItem(REPLIES_KEY(workId), JSON.stringify(data));
}

export async function getReplies(workId, commentId) {
    try {
        const response = await api.get(`/work/${workId}/comments/${commentId}/replies`);
        return response.data?.content ?? response.data ?? [];
    } catch {
        const all = loadLocalReplies(workId);
        return all[commentId] || [];
    }
}

export async function createReply(workId, commentId, content, authorName, isAdminUser = false) {
    try {
        const response = await api.post(`/work/${workId}/comments/${commentId}/replies`, { content });
        return { ...response.data, isAdmin: isAdminUser };
    } catch {
        const all = loadLocalReplies(workId);
        const list = all[commentId] || [];
        const newReply = {
            id: `local_${Date.now()}`,
            content,
            authorName: authorName || 'Autor',
            createdAt: new Date().toISOString(),
            isAdmin: isAdminUser,
        };
        all[commentId] = [...list, newReply];
        saveLocalReplies(workId, all);
        return newReply;
    }
}