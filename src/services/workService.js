import api from './api';

export async function getAllWorks(type = null, size = 1000) {
    if (type === 'News') {
        const response = await api.get('/news', { params: { size } });
        return response.data.content || response.data || [];
    }

    const params = { size };
    if (type) params.type = type;

    const response = await api.get('/work', { params });
    
    if (Array.isArray(response.data)) return response.data;
    if (response.data?.content && Array.isArray(response.data.content)) return response.data.content;
    return [];
}

export async function getWorkById(id, type = null) {
    if (type === 'News') {
        const response = await api.get(`/news/${id}`);
        return response.data;
    }
    const response = await api.get(`/work/${id}`);
    return response.data;
}

export async function createWork(type, data, imageFile = null) {
    // Retiramos a exigência do "&& imageFile" daqui.
    // Sempre usará FormData para esses três tipos.
    if (['arts', 'infographics', 'news'].includes(type)) {
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        
        // Só anexa a imagem se ela existir
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        const response = await api.post(type === 'news' ? '/news' : `/work/${type}`, formData);
        return response.data;
    }

    const response = await api.post(type === 'news' ? '/news' : `/work/${type}`, data);
    return response.data;
}

export async function updateWork(type, id, data, imageFile = null) {
    // Mesma lógica na edição
    if (['arts', 'infographics', 'news'].includes(type)) {
        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(data)], { type: 'application/json' }));
        
        // Só anexa a imagem se ela existir
        if (imageFile) {
            formData.append('image', imageFile);
        }
        
        const response = await api.put(type === 'news' ? `/news/${id}` : `/work/${type}/${id}`, formData);
        return response.data;
    }

    const response = await api.put(type === 'news' ? `/news/${id}` : `/work/${type}/${id}`, data);
    return response.data;
}

export async function deleteWork(id, type = null) {
    if (type === 'news') {
        await api.delete(`/news/${id}`);
        return;
    }
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