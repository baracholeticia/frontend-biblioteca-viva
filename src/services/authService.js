import api from './api';

export async function login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    const { token } = response.data;
    localStorage.setItem('token', token);
    localStorage.setItem('userEmail', email);

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const role = payload.role || payload.authorities || payload.roles || '';
        localStorage.setItem('userRole', role);
    } catch (e) {
        console.error('Erro ao decodificar role do token:', e);
    }

    return response.data;
}

export async function register(name, email, password) {
    const response = await api.post('/auth/register/aluno', { name, email, password });
    return response.data;
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
}

export function isLoggedIn() {
    return !!localStorage.getItem('token');
}

export function getUserRole() {
    return localStorage.getItem('userRole') || '';
}

export async function requestPasswordReset(email) {
    const response = await api.post('/auth/password-reset/request', { email });
    return response.data;
}

export async function verifyPasswordResetCode(email, code) {
    const response = await api.post('/auth/password-reset/verify', { email, code });
    return response.data; // Retorna { resetToken, expiresInSeconds }
}

export async function confirmPasswordReset(resetToken, newPassword) {
    const response = await api.post('/auth/password-reset/confirm', { resetToken, newPassword });
    return response.data;
}