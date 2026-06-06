import api from './api';

export async function getUserByEmail(email) {
    const response = await api.get(`/user/find-by-email`, { params: { email } });
    return response.data;
}