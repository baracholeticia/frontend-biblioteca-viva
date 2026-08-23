import api from './api';

export async function getAllWorks(type = null, size = 1000) {
    const params = { size };
    if (type) params.type = type;

    const response = await api.get('/work', { params });
    
    if (Array.isArray(response.data)) return response.data;
    if (response.data?.content && Array.isArray(response.data.content)) return response.data.content;
    return [];
}

export async function getWorkById(id) {
    const response = await api.get(`/work/${id}`);
    return response.data;
}

export async function createWork(type, data, imageFile = null) {
    if (['arts', 'infographics'].includes(type) && imageFile) {
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        formData.append('image', imageFile);
        
        const response = await api.post(`/work/${type}`, formData);
        return response.data;
    }

    const response = await api.post(`/work/${type}`, data);
    return response.data;
}

export async function updateWork(type, id, data, imageFile = null) {
    if (['arts', 'infographics'].includes(type)) {
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        if (imageFile) formData.append('image', imageFile);
        
        const response = await api.put(`/work/${type}/${id}`, formData);
        return response.data;
    }

    const response = await api.put(`/work/${type}/${id}`, data);
    return response.data;
}

export async function deleteWork(id) {
    await api.delete(`/work/${id}`);
}

export async function likeWork(id) {
    const response = await api.put(`/work/${id}/like`);
    return response.data;
}

export async function getHomeData() {
    const response = await api.get('/work/home');
    return response.data;
}

export async function getLikedWorks() {
    const response = await api.get('/work/liked');
    return response.data; 
}