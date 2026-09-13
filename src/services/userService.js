import api from './api';

export async function getUserByEmail(email) {
    const response = await api.get(`/user/find-by-email`, { params: { email } });
    return response.data;
}

export async function getAllUsers(page = 0, size = 100) {
    const response = await api.get('/user', { params: { page, size } });
    return response.data.content || response.data || [];
}