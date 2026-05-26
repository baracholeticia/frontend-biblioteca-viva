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
    const response = await api.post('/auth/register', { name, email, password });
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