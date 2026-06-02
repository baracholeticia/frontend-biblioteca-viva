import api from './api';

export async function getAllUsers(status = null, page = 0, size = 50) {
    const params = { page, size };
    if (status) params.status = status;
    const response = await api.get('/admin', { params });
    return response.data.content || [];
}

export async function approveUser(id) {
    await api.patch(`/admin/approve/${id}`);
}

export async function rejectUser(id) {
    await api.patch(`/admin/reject/${id}`);
}

export async function blockUser(id) {
    await api.patch(`/admin/block/${id}`);
}

export async function deleteUser(id) {
    await api.delete(`/admin/${id}`);
}

export async function getDashboardData() {
    const response = await api.get('/admin/dashboard');
    return response.data;
}

export async function getAllAdminComments(page = 0, size = 100) {
    const response = await api.get('/admin/comments', { params: { page, size } });
    return response.data.content || [];
}

// PROVISORIO 


export async function getStaff() {
    const response = await api.get('/admin', { params: { page: 0, size: 100 } });
    const todos = response.data.content || [];
    return todos.filter(u => u.role === 'ADMIN' || u.role === 'CURADOR');
}

export async function createStaff(data) {
    console.warn("Backend ainda não possui rota POST /admin/staff. Simulação executada.");
    return { message: "Simulação de criação ok." };
}

export async function deleteStaff(id) {
    console.warn("Usando a rota geral de deleção provisoriamente.");
    await api.delete(`/admin/users/${id}`);
}