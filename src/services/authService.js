import api from './api';

export async function login(email, password) {
    const response = await api.post('/auth/login', { email, password });
    
    const { accessToken, role } = response.data;
    
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('userEmail', email);
    localStorage.setItem('userRole', role);

    return response.data;
}

export async function register(name, email, password) {
    const response = await api.post('/auth/register/aluno', { name, email, password });
    return response.data;
}

export async function logout() {
    try {
        await api.post('/auth/logout');
    } catch (error) {
        console.error('Erro ao fazer logout no servidor', error);
    } finally {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('userEmail');
        localStorage.removeItem('userRole');
    }
}

export function isLoggedIn() {
    return !!localStorage.getItem('accessToken');
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
    return response.data; 
}

export async function confirmPasswordReset(resetToken, newPassword) {
    const response = await api.post('/auth/password-reset/confirm', { resetToken, newPassword });
    return response.data;
}